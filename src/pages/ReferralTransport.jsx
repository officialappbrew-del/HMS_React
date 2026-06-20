import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  Plane,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  Clock,
  ArrowRight,
  Menu,
  X,
  Search,
  Filter
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { createReferral, updateReferral, completeTransport } from '../features/referralSlice';

const ReferralTransport = () => {
  const referralState = useSelector(state => state.referral || {});
  const referrals = referralState.referrals || [];
  const medicalEvacuations = referralState.medicalEvacuations || [];
  const transferCompliance = referralState.transferCompliance || [];
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('active');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showEvacuationModal, setShowEvacuationModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeReferrals = referrals.filter(r => {
    if (!r || !r.status) return false;
    return r.status !== 'Completed';
  });
  
  const completedReferrals = referrals.filter(r => {
    if (!r || !r.status) return false;
    return r.status === 'Completed';
  });

  // Filter items based on search query
  const getFilteredItems = () => {
    if (!searchQuery) {
      switch(activeTab) {
        case 'active': return activeReferrals;
        case 'history': return completedReferrals;
        case 'evacuation': return medicalEvacuations;
        case 'compliance': return transferCompliance;
        default: return [];
      }
    }

    const query = searchQuery.toLowerCase();
    switch(activeTab) {
      case 'active':
        return activeReferrals.filter(item => 
          item.patientName?.toLowerCase().includes(query) ||
          item.referralType?.toLowerCase().includes(query) ||
          item.status?.toLowerCase().includes(query)
        );
      case 'history':
        return completedReferrals.filter(item =>
          item.patientName?.toLowerCase().includes(query) ||
          item.referralType?.toLowerCase().includes(query) ||
          item.outcome?.toLowerCase().includes(query)
        );
      case 'evacuation':
        return medicalEvacuations.filter(item =>
          item.patientName?.toLowerCase().includes(query) ||
          item.evacuationType?.toLowerCase().includes(query) ||
          item.status?.toLowerCase().includes(query)
        );
      case 'compliance':
        return transferCompliance.filter(item => {
          const referral = referrals.find(r => r.referralId === item.referralId);
          return (
            referral?.patientName?.toLowerCase().includes(query) ||
            referral?.referralType?.toLowerCase().includes(query)
          );
        });
      default: return [];
    }
  };

  const filteredItems = getFilteredItems();

  const getReferralTypeColor = (type) => {
    switch(type) {
      case 'Maternal Referral': return 'bg-pink-100 text-pink-800';
      case 'Neonatal Transfer': return 'bg-blue-100 text-blue-800';
      case 'Critical Care Transfer': return 'bg-red-100 text-red-800';
      case 'Inter-facility Transfer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatus = (referralId) => {
    return transferCompliance.filter(c => c.referralId === referralId);
  };

  const handleCreateReferral = () => {
    console.log('Creating new referral');
    setShowReferralModal(false);
  };

  const handleCreateEvacuation = () => {
    console.log('Creating medical evacuation');
    setShowEvacuationModal(false);
  };

  const handleUpdateReferral = () => {
    if (!selectedReferral) return;
    console.log('Updating referral:', selectedReferral.referralId);
    setSelectedReferral(null);
  };

  return (
    <div className="referral-transport p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="text-lg font-bold text-gray-800">Referral & Transport</div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Plane className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-nigerian-green" />
            Referral & Transport Management
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Coordinate inter-facility transfers and medical evacuations</p>
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

        {/* Responsive Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowReferralModal(true)}
            className="flex-1 md:flex-none px-4 py-2.5 md:px-6 md:py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">New Referral</span>
              <span className="sm:hidden">Referral</span>
            </span>
          </button>
          <button
            onClick={() => setShowEvacuationModal(true)}
            className="flex-1 md:flex-none px-4 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
          >
            <Plane className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">Medical Evacuation</span>
              <span className="sm:hidden">Evacuation</span>
            </span>
          </button>
        </div>
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
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-nigerian-green">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-nigerian-green mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Active Referrals</p>
              <p className="text-nigerian-green font-bold text-lg md:text-xl lg:text-2xl">{activeReferrals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-pink-600">
          <div className="flex items-center">
            <Users className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-pink-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Maternal</p>
              <p className="text-pink-600 font-bold text-lg md:text-xl lg:text-2xl">
                {referrals.filter(r => r.referralType === 'Maternal Referral').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Users className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Neonatal</p>
              <p className="text-blue-600 font-bold text-lg md:text-xl lg:text-2xl">
                {referrals.filter(r => r.referralType === 'Neonatal Transfer').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-red-600">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-red-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Critical Care</p>
              <p className="text-red-600 font-bold text-lg md:text-xl lg:text-2xl">
                {referrals.filter(r => r.referralType === 'Critical Care Transfer').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-purple-600 col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center">
            <Plane className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Evacuations</p>
              <p className="text-purple-600 font-bold text-lg md:text-xl lg:text-2xl">{medicalEvacuations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Categories</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setActiveTab('active'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'active' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                Active Referrals ({activeReferrals.length})
              </button>
              <button
                onClick={() => { setActiveTab('history'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'history' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                History ({completedReferrals.length})
              </button>
              <button
                onClick={() => { setActiveTab('evacuation'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'evacuation' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                Medical Evacuations ({medicalEvacuations.length})
              </button>
              <button
                onClick={() => { setActiveTab('compliance'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'compliance' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                Compliance Tracking ({transferCompliance.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="hidden md:flex gap-2 lg:gap-4 mb-4 lg:mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'active'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Active Referrals ({activeReferrals.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'history'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          History ({completedReferrals.length})
        </button>
        <button
          onClick={() => setActiveTab('evacuation')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'evacuation'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Medical Evacuations ({medicalEvacuations.length})
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'compliance'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Compliance Tracking ({transferCompliance.length})
        </button>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <span className="font-medium text-gray-700">
            {activeTab === 'active' && `Active Referrals (${filteredItems.length})`}
            {activeTab === 'history' && `History (${filteredItems.length})`}
            {activeTab === 'evacuation' && `Evacuations (${filteredItems.length})`}
            {activeTab === 'compliance' && `Compliance (${filteredItems.length})`}
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

      {/* Active Referrals Tab */}
      {activeTab === 'active' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <MapPin className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No active referrals</p>
            </div>
          ) : (
            filteredItems.map(referral => (
              <div key={referral.referralId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-nigerian-green">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3 md:mb-4">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="text-base md:text-lg font-bold truncate">{referral.patientName || 'Unknown Patient'}</h3>
                      <span className={`inline-block px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold ${getReferralTypeColor(referral.referralType)}`}>
                        {referral.referralType || 'Unknown Type'}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{referral.referralReason || 'No reason provided'}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className="font-bold text-sm md:text-base">{referral.status || 'Unknown'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      From
                    </p>
                    <p className="font-bold text-xs md:text-sm truncate">{referral.referringFacility?.name || 'Unknown Facility'}</p>
                    <p className="text-xs text-gray-600 truncate">{referral.referringFacility?.address || 'No address'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      To
                    </p>
                    <p className="font-bold text-xs md:text-sm truncate">{referral.receivingFacility?.name || 'Unknown Facility'}</p>
                    <p className="text-xs text-gray-600 truncate">{referral.receivingFacility?.address || 'No address'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 mb-3 md:mb-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Patient Age</p>
                    <p className="font-bold text-sm md:text-base">{referral.age || 'N/A'} years</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Gender</p>
                    <p className="font-bold text-sm md:text-base">{referral.gender || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Ambulance</p>
                    <p className="font-bold text-xs md:text-sm truncate">{referral.ambulanceId || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Referral Date</p>
                    <p className="font-bold text-xs md:text-sm">
                      {referral.referralDate ? new Date(referral.referralDate).toLocaleDateString('en-NG') : 'No date'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReferral(referral)}
                  className="w-full px-3 py-2 md:px-4 md:py-2 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium text-sm md:text-base transition-colors"
                >
                  View Details & Update
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No completed referrals</p>
            </div>
          ) : (
            filteredItems.map(referral => (
              <div key={referral.referralId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-bold text-sm md:text-base truncate">{referral.patientName || 'Unknown Patient'}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{referral.referralType || 'Unknown Type'}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-green-600 text-sm md:text-base flex items-center">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
                      <span className="truncate">{referral.outcome || 'Completed'}</span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {referral.arrivalTime ? new Date(referral.arrivalTime).toLocaleDateString('en-NG') : 'No date'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Medical Evacuations Tab */}
      {activeTab === 'evacuation' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center border-l-4 border-purple-600">
              <Plane className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No medical evacuations</p>
            </div>
          ) : (
            filteredItems.map(evacuation => (
              <div key={evacuation.evacuationId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-purple-600">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3 md:mb-4">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-purple-600 flex items-center">
                      <Plane className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
                      <span className="truncate">{evacuation.patientName || 'Unknown Patient'}</span>
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{evacuation.evacuationType || 'Unknown Type'}</p>
                  </div>
                  <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold self-start ${
                    evacuation.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                    evacuation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {evacuation.status || 'Unknown'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">From</p>
                    <p className="font-bold text-xs md:text-sm truncate">
                      {evacuation.originCity || 'Unknown'}, {evacuation.originCountry || 'Unknown'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">To</p>
                    <p className="font-bold text-xs md:text-sm truncate">
                      {evacuation.destinationCity || 'Unknown'}, {evacuation.destinationCountry || 'Unknown'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">Cost (₦)</p>
                    <p className="font-bold text-blue-600 text-sm md:text-base">{(evacuation.cost || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 md:p-4 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <p className="text-xs md:text-sm"><strong>Destination:</strong> <span className="truncate">{evacuation.destinationFacility || 'Unknown'}</span></p>
                    <p className="text-xs md:text-sm"><strong>Funding:</strong> <span className="truncate">{evacuation.fundingSource || 'Unknown'}</span></p>
                    <p className="text-xs md:text-sm"><strong>Transport:</strong> <span className="truncate">{evacuation.transportMode || 'Unknown'}</span></p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No compliance records</p>
            </div>
          ) : (
            filteredItems.map(compliance => {
              const referral = referrals.find(r => r.referralId === compliance.referralId);
              return (
                <div key={compliance.complianceId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 md:mb-4">
                    <div>
                      <p className="font-bold text-sm md:text-base truncate">{referral?.patientName || 'Unknown Patient'}</p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">{referral?.referralType || 'Unknown Type'}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold ${
                        compliance.referralProtocolFollowed && compliance.documentationComplete && compliance.patientConsentObtained
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {compliance.referralProtocolFollowed && compliance.documentationComplete && compliance.patientConsentObtained ? (
                          <>
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">Fully Compliant</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">Partial</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs md:text-sm text-gray-600">Protocol</p>
                      <p className="font-bold text-sm flex items-center">
                        {compliance.referralProtocolFollowed ? (
                          <><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-1 flex-shrink-0" /><span className="truncate">Yes</span></>
                        ) : (
                          <><AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-600 mr-1 flex-shrink-0" /><span className="truncate">No</span></>
                        )}
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs md:text-sm text-gray-600">Documentation</p>
                      <p className="font-bold text-sm flex items-center">
                        {compliance.documentationComplete ? (
                          <><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-1 flex-shrink-0" /><span className="truncate">Complete</span></>
                        ) : (
                          <><AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-600 mr-1 flex-shrink-0" /><span className="truncate">Incomplete</span></>
                        )}
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs md:text-sm text-gray-600">Consent</p>
                      <p className="font-bold text-sm flex items-center">
                        {compliance.patientConsentObtained ? (
                          <><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-1 flex-shrink-0" /><span className="truncate">Yes</span></>
                        ) : (
                          <><AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-600 mr-1 flex-shrink-0" /><span className="truncate">No</span></>
                        )}
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs md:text-sm text-gray-600">Follow-up</p>
                      <p className="font-bold text-sm flex items-center">
                        {compliance.followUpArrangement ? (
                          <><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-1 flex-shrink-0" /><span className="truncate">Arranged</span></>
                        ) : (
                          <><AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-600 mr-1 flex-shrink-0" /><span className="truncate">Pending</span></>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modals */}
      <GenericModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        title="Create New Referral"
        size="lg"
      >
        <div className="space-y-3 md:space-y-4">
          <select className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base">
            <option value="">Select Referral Type</option>
            <option value="Maternal Referral">Maternal Referral</option>
            <option value="Neonatal Transfer">Neonatal Transfer</option>
            <option value="Critical Care Transfer">Critical Care Transfer</option>
            <option value="Inter-facility Transfer">Inter-facility Transfer</option>
          </select>
          <input type="text" placeholder="Patient Name" className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
          <textarea placeholder="Referral Reason" rows="3" className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
          <select className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base">
            <option value="">Select Receiving Facility</option>
            <option value="Lagos Central Hospital">Lagos Central Hospital</option>
            <option value="Tertiary Hospital">Tertiary Hospital</option>
            <option value="Specialized Center">Specialized Center</option>
          </select>
          <div className="flex gap-2 pt-2">
            <button onClick={handleCreateReferral} className="flex-1 bg-nigerian-green text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-green-700 font-medium text-sm md:text-base transition-colors">
              Create Referral
            </button>
            <button onClick={() => setShowReferralModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      <GenericModal
        isOpen={showEvacuationModal}
        onClose={() => setShowEvacuationModal(false)}
        title="Create Medical Evacuation"
        size="lg"
      >
        <div className="space-y-3 md:space-y-4">
          <input type="text" placeholder="Patient Name" className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <input type="text" placeholder="Origin Country" className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
            <input type="text" placeholder="Destination Country" className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
          </div>
          <select className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base">
            <option value="">Select Funding Source</option>
            <option value="Insurance">Insurance</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
          </select>
          <div className="flex gap-2 pt-2">
            <button onClick={handleCreateEvacuation} className="flex-1 bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 font-medium text-sm md:text-base transition-colors">
              Create Evacuation
            </button>
            <button onClick={() => setShowEvacuationModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {selectedReferral && (
        <GenericModal
          isOpen={!!selectedReferral}
          onClose={() => setSelectedReferral(null)}
          title={`Referral: ${selectedReferral.referralId || 'Unknown'}`}
          size="lg"
        >
          <div className="space-y-3 md:space-y-4">
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Current Status</p>
              <p className="font-bold text-base md:text-lg">{selectedReferral.status || 'Unknown'}</p>
            </div>
            <select className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base">
              <option value="Referred">Referred</option>
              <option value="In Transit">In Transit</option>
              <option value="Arrived">Arrived</option>
              <option value="Completed">Completed</option>
            </select>
            <textarea placeholder="Notes" rows="3" className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
            <div className="flex gap-2">
              <button onClick={handleUpdateReferral} className="flex-1 bg-nigerian-green text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-green-700 font-medium text-sm md:text-base transition-colors">
                Update Status
              </button>
              <button onClick={() => setSelectedReferral(null)} className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors">
                Close
              </button>
            </div>
          </div>
        </GenericModal>
      )}
    </div>
  );
};

export default ReferralTransport;