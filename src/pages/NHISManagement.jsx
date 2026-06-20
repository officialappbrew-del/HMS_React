import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Search,
  Filter,
  Plus,
  Shield,
  AlertTriangle,
  TrendingUp,
  Calendar,
  UserCheck,
  Receipt
} from 'lucide-react';
import {
  registerEnrollee,
  updateEnrollee,
  createPreAuthorization,
  approvePreAuthorization,
  rejectPreAuthorization,
  createClaim,
  processClaim,
  recordCapitation,
  detectFraud,
  searchNHIS,
  sortNHIS,
  filterNHIS
} from '../features/nhisSlice';
import Pagination from '../components/Pagination';

const NHISManagement = () => {
  const dispatch = useDispatch();
  const {
    enrollees,
    claims,
    capitationRecords,
    preAuthorizations,
    serviceCodes,
    diagnosisCodes,
    stats,
    searchTerm,
    sortBy,
    filterBy
  } = useSelector(state => state.nhis);

  const [activeTab, setActiveTab] = useState('overview');
  const [showEnrolleeModal, setShowEnrolleeModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showPreAuthModal, setShowPreAuthModal] = useState(false);
  const [selectedEnrollee, setSelectedEnrollee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [enrolleeForm, setEnrolleeForm] = useState({
    nhisNumber: '',
    name: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    employer: '',
    planType: 'individual',
    principalId: '', // For dependents
    relationship: '' // For dependents
  });

  const [claimForm, setClaimForm] = useState({
    enrolleeId: '',
    diagnosis: '',
    services: [],
    totalAmount: 0
  });

  const [preAuthForm, setPreAuthForm] = useState({
    enrolleeId: '',
    requestedService: '',
    diagnosis: '',
    estimatedCost: 0,
    clinicalNotes: ''
  });

  // Filter and search logic
  const filteredEnrollees = enrollees
    .filter(enrollee => {
      const matchesSearch = !searchTerm ||
        enrollee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollee.nhisNumber.includes(searchTerm);
      const matchesFilter = filterBy === 'all' || enrollee.status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.registrationDate) - new Date(a.registrationDate);
      return 0;
    });

  const filteredClaims = claims
    .filter(claim => {
      const matchesSearch = !searchTerm ||
        claim.enrollee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.id.includes(searchTerm);
      const matchesFilter = filterBy === 'all' || claim.status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.claimDate) - new Date(a.claimDate);
      if (sortBy === 'amount') return b.totalAmount - a.totalAmount;
      return 0;
    });

  const paginatedData = activeTab === 'enrollees' ? filteredEnrollees : filteredClaims;
  const paginatedItems = paginatedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRegisterEnrollee = (e) => {
    e.preventDefault();

    // Validate NHIS number format
    const nhisPattern = /^NHIS\/\d{4}\/\d{7}$/;
    if (!nhisPattern.test(enrolleeForm.nhisNumber)) {
      alert('Invalid NHIS number format. Should be NHIS/XXXX/XXXXXXX');
      return;
    }

    dispatch(registerEnrollee(enrolleeForm));
    setEnrolleeForm({
      nhisNumber: '',
      name: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      address: '',
      employer: '',
      planType: 'individual',
      principalId: '',
      relationship: ''
    });
    setShowEnrolleeModal(false);
  };

  const handleCreateClaim = (e) => {
    e.preventDefault();
    dispatch(createClaim(claimForm));
    setClaimForm({
      enrolleeId: '',
      diagnosis: '',
      services: [],
      totalAmount: 0
    });
    setShowClaimModal(false);
  };

  const handleCreatePreAuth = (e) => {
    e.preventDefault();
    dispatch(createPreAuthorization(preAuthForm));
    setPreAuthForm({
      enrolleeId: '',
      requestedService: '',
      diagnosis: '',
      estimatedCost: 0,
      clinicalNotes: ''
    });
    setShowPreAuthModal(false);
  };

  const handleProcessClaim = (claimId, status, approvedAmount, rejectionReason) => {
    dispatch(processClaim({
      claimId,
      status,
      approvedAmount,
      rejectionReason
    }));
  };

  const handlePreAuthDecision = (preAuthId, approved, approvedAmount, approvedServices, reason) => {
    if (approved) {
      dispatch(approvePreAuthorization({
        id: preAuthId,
        approvedAmount,
        approvedServices,
        notes: reason
      }));
    } else {
      dispatch(rejectPreAuthorization({
        id: preAuthId,
        reason
      }));
    }
  };

  const addServiceToClaim = (serviceCode) => {
    const service = Object.values(serviceCodes).find(s => s.code === serviceCode);
    if (service) {
      const newService = {
        code: service.code,
        description: service.description,
        quantity: 1,
        unitPrice: service.tariff,
        total: service.tariff
      };

      setClaimForm({
        ...claimForm,
        services: [...claimForm.services, newService],
        totalAmount: claimForm.totalAmount + service.tariff
      });
    }
  };

  const removeServiceFromClaim = (index) => {
    const service = claimForm.services[index];
    setClaimForm({
      ...claimForm,
      services: claimForm.services.filter((_, i) => i !== index),
      totalAmount: claimForm.totalAmount - service.total
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingPreAuths = preAuthorizations.filter(p => p.status === 'pending');
  const pendingClaims = claims.filter(c => c.status === 'submitted');

  return (
    <div className="nhis-management p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-500" />
          NHIS Management System
        </h1>
        <p className="text-gray-600 mt-2">National Health Insurance Scheme claims and enrollee management</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Enrollees</p>
              <p className="text-3xl font-bold mt-2">{stats.activeEnrollees}</p>
            </div>
            <Users className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Claims</p>
              <p className="text-3xl font-bold mt-2">{stats.totalClaims}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Items</p>
              <p className="text-3xl font-bold mt-2">{pendingPreAuths.length + pendingClaims.length}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Capitation</p>
              <p className="text-3xl font-bold mt-2">₦{stats.totalCapitation.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'enrollees', label: 'Enrollees', icon: Users },
            { id: 'claims', label: 'Claims', icon: FileText },
            { id: 'preauth', label: 'Pre-Authorizations', icon: UserCheck },
            { id: 'capitation', label: 'Capitation', icon: Receipt }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Pending Actions
              </h3>

              <div className="space-y-3">
                {pendingPreAuths.slice(0, 3).map(preAuth => (
                  <div key={preAuth.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium">Pre-Auth: {preAuth.enrolleeName}</p>
                    <p className="text-sm text-gray-600">{preAuth.requestedService}</p>
                    <p className="text-xs text-gray-500">₦{preAuth.estimatedCost.toLocaleString()}</p>
                  </div>
                ))}

                {pendingClaims.slice(0, 2).map(claim => (
                  <div key={claim.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium">Claim: {claim.enrollee?.name}</p>
                    <p className="text-sm text-gray-600">{claim.diagnosis}</p>
                    <p className="text-xs text-gray-500">₦{claim.totalAmount.toLocaleString()}</p>
                  </div>
                ))}

                {pendingPreAuths.length === 0 && pendingClaims.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No pending actions</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Recent Activity
              </h3>

              <div className="space-y-3">
                {claims.slice(-5).reverse().map(claim => (
                  <div key={claim.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{claim.enrollee?.name}</p>
                        <p className="text-xs text-gray-600">{claim.diagnosis}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}

                {claims.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'enrollees' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search enrollees..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchNHIS(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterNHIS(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Enrollees</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(sortNHIS(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="name">Name</option>
                  <option value="date">Registration Date</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowEnrolleeModal(true)}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register Enrollee
                </button>
              </div>
            </div>

            {/* Enrollees Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NHIS Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map(enrollee => (
                    <tr key={enrollee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {enrollee.nhisNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{enrollee.name}</div>
                          <div className="text-sm text-gray-500">{enrollee.phone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollee.planType}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(enrollee.status)}`}>
                          {enrollee.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollee.registrationDate).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedEnrollee(enrollee);
                            setShowClaimModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Create Claim
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'claims' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search claims..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchNHIS(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterNHIS(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Claims</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(sortNHIS(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Claim
                </button>
              </div>
            </div>

            {/* Claims Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map(claim => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {claim.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{claim.enrollee?.name}</div>
                          <div className="text-sm text-gray-500">{claim.enrollee?.nhisNumber}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {claim.diagnosis}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{claim.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(claim.claimDate).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {claim.status === 'submitted' && (
                          <>
                            <button
                              onClick={() => handleProcessClaim(claim.id, 'approved', claim.totalAmount)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) handleProcessClaim(claim.id, 'rejected', 0, reason);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'preauth' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Pre-Authorizations</h3>
            <div className="space-y-3">
              {preAuthorizations.map(preAuth => (
                <div key={preAuth.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{preAuth.enrolleeName}</p>
                      <p className="text-sm text-gray-600">{preAuth.requestedService}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(preAuth.status)}`}>
                      {preAuth.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Diagnosis</p>
                      <p className="text-sm">{preAuth.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estimated Cost</p>
                      <p className="text-sm">₦{preAuth.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Requested</p>
                      <p className="text-sm">{new Date(preAuth.requestedAt).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Approved Amount</p>
                      <p className="text-sm">₦{preAuth.approvedAmount?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>

                  {preAuth.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const amount = prompt('Approved amount:', preAuth.estimatedCost);
                          if (amount) handlePreAuthDecision(preAuth.id, true, parseInt(amount), [preAuth.requestedService]);
                        }}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Rejection reason:');
                          if (reason) handlePreAuthDecision(preAuth.id, false, 0, [], reason);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {preAuthorizations.length === 0 && (
                <p className="text-gray-500 text-center py-8">No pre-authorizations found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'capitation' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Capitation Records</h3>
            <div className="space-y-3">
              {capitationRecords.map(record => (
                <div key={record.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{record.enrolleeId}</p>
                      <p className="text-sm text-gray-600">{record.month}/{record.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{record.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{record.servicesProvided} services</p>
                    </div>
                  </div>
                </div>
              ))}

              {capitationRecords.length === 0 && (
                <p className="text-gray-500 text-center py-8">No capitation records found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'enrollees' || activeTab === 'claims') && paginatedData.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedData.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Register Enrollee Modal */}
      {showEnrolleeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Register NHIS Enrollee
              </h3>
              <form onSubmit={handleRegisterEnrollee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NHIS Number</label>
                  <input
                    type="text"
                    value={enrolleeForm.nhisNumber}
                    onChange={(e) => setEnrolleeForm({...enrolleeForm, nhisNumber: e.target.value})}
                    placeholder="NHIS/XXXX/XXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={enrolleeForm.name}
                    onChange={(e) => setEnrolleeForm({...enrolleeForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={enrolleeForm.dateOfBirth}
                      onChange={(e) => setEnrolleeForm({...enrolleeForm, dateOfBirth: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={enrolleeForm.gender}
                      onChange={(e) => setEnrolleeForm({...enrolleeForm, gender: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={enrolleeForm.phone}
                    onChange={(e) => setEnrolleeForm({...enrolleeForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
                  <select
                    value={enrolleeForm.planType}
                    onChange={(e) => setEnrolleeForm({...enrolleeForm, planType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="individual">Individual</option>
                    <option value="family">Family</option>
                    <option value="retiree">Retiree</option>
                    <option value="vulnerable">Vulnerable Group</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Register Enrollee
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEnrolleeModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Create NHIS Claim
              </h3>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enrollee</label>
                    <select
                      value={claimForm.enrolleeId}
                      onChange={(e) => setClaimForm({...claimForm, enrolleeId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select enrollee...</option>
                      {enrollees.map(enrollee => (
                        <option key={enrollee.id} value={enrollee.id}>
                          {enrollee.name} ({enrollee.nhisNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                    <select
                      value={claimForm.diagnosis}
                      onChange={(e) => setClaimForm({...claimForm, diagnosis: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select diagnosis...</option>
                      {Object.values(diagnosisCodes).map(diag => (
                        <option key={diag.code} value={diag.description}>
                          {diag.code} - {diag.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Services Provided</h4>

                  {/* Available Services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 max-h-48 overflow-y-auto">
                    {Object.values(serviceCodes).map(service => (
                      <button
                        key={service.code}
                        onClick={() => addServiceToClaim(service.code)}
                        className="p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 text-left"
                      >
                        <div className="font-medium text-sm">{service.description}</div>
                        <div className="text-xs text-gray-600">Code: {service.code} • ₦{service.tariff.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Services */}
                  {claimForm.services.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Selected Services</h5>
                      <div className="space-y-2">
                        {claimForm.services.map((service, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium">{service.description}</span>
                              <span className="text-sm text-gray-600 ml-2">({service.code})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">₦{service.total.toLocaleString()}</span>
                              <button
                                onClick={() => removeServiceFromClaim(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium">Total Claim Amount: ₦{claimForm.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateClaim}
                    disabled={!claimForm.enrolleeId || !claimForm.diagnosis || claimForm.services.length === 0}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium disabled:bg-gray-300"
                  >
                    Submit Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NHISManagement;