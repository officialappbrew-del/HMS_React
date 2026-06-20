import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  addPatient,
  updatePatient,
  deletePatient,
  archivePatient, // Add this to your slice
  searchPatients,
  sortPatients,
  filterPatients,
} from '../features/patientSlice';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";
import nigerianData from '../assets/nigerian-data.json';


const PatientManagement = () => {
  const dispatch = useDispatch();
  const { filteredPatients, searchTerm, sortBy, filterBy, error } = useSelector(
    state => state.patient
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    name: '',
    nin: '',
    phone: '',
    email: '',
    address: '',
    tribe: '',
    country: 'Nigeria',
    lga: '',
    state: '',
    dateOfBirth: '',
    bloodType: '',
  });

  const [availableLGAs, setAvailableLGAs] = useState([]);
  const [nigerianStates, setNigerianStates] = useState([]);
  const [nigerianData, setNigerianData] = useState({});
  const [countries, setCountries] = useState([]);
  const [countryStates, setCountryStates] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    patientData: null,
    action: null,
  });

  // Load countries, states, and Nigerian LGAs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries and states from CountriesNow API
        const statesResponse = await fetch('https://countriesnow.space/api/v0.1/countries/states');
        const statesData = await statesResponse.json();

        const countriesList = statesData.data.map(country => country.name);
        const statesMap = {};
        statesData.data.forEach(country => {
          statesMap[country.name] = country.states.map(state => state.name);
        });

        setCountries(countriesList);
        setCountryStates(statesMap);

        // Load Nigerian LGAs from local JSON
        setNigerianStates(Object.keys(nigerianData));
      } catch (error) {
        console.error('Error fetching global data:', error);
        // Fallback
        setCountries(['Nigeria']);
        setCountryStates({ 'Nigeria': Object.keys(nigerianData) });
        setNigerianStates(Object.keys(nigerianData));
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const tribes = ['Yoruba', 'Hausa', 'Igbo', 'Fulani', 'Ijaw', 'Kanuri', 'Ibibio', 'Tiv', 'Other'];
  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  // Open modal for delete
  const handleDeleteClick = (patient) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      patientData: patient,
      action: () => dispatch(deletePatient(patient.id)),
    });
  };

  // Open modal for edit
  const handleEditClick = (patient) => {
    setModalConfig({
      isOpen: true,
      type: 'edit',
      patientData: patient,
      action: () => {
        // Ensure country is set for existing patients
        const patientWithCountry = { ...patient, country: patient.country || 'Nigeria' };
        setFormData(patientWithCountry);
        setAvailableLGAs(nigerianData[patient.state] || []);
        setEditingId(patient.id);
        setShowForm(true);
      },
    });
  };

  // Handle soft delete (archive)
  const handleSoftDelete = (patient) => {
    dispatch(archivePatient(patient.id));
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // Handle modal confirm
  const handleModalConfirm = () => {
    if (modalConfig.action) {
      modalConfig.action();
    }
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Name and Phone are required fields');
      return;
    }

    if (editingId) {
      dispatch(updatePatient({ ...formData, id: editingId }));
      setEditingId(null);
    } else {
      const newPatient = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      dispatch(addPatient(newPatient));
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nin: '',
      phone: '',
      email: '',
      address: '',
      tribe: '',
      country: 'Nigeria',
      lga: '',
      state: '',
      dateOfBirth: '',
      bloodType: '',
    });
    setAvailableLGAs([]);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'country') {
      // Reset state and LGA when country changes
      setFormData(prev => ({ ...prev, state: '', lga: '' }));
      setAvailableLGAs([]);
      // Set states based on country
      setNigerianStates(countryStates[value] || []);
    } else if (name === 'state') {
      // Reset LGA when state changes
      setFormData(prev => ({ ...prev, lga: '' }));
      // Set LGAs for the selected state (only for Nigeria)
      if (formData.country === 'Nigeria') {
        setAvailableLGAs(nigerianData[value] || []);
      }
    }
  };

  const handleSearch = (e) => {
    dispatch(searchPatients(e.target.value));
  };

  const handleSort = (e) => {
    dispatch(sortPatients(e.target.value));
  };

  const handleFilter = (e) => {
    dispatch(filterPatients(e.target.value));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate pagination
  const totalItems = filteredPatients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPatients = filteredPatients.slice(startIndex, endIndex);

  // Get modal configuration based on type
  const getModalConfig = () => {
    const configs = {
      delete: {
        title: 'Delete Patient Record',
        message: 'Are you sure you want to permanently delete this patient record? This action is irreversible and will remove all associated data.',
        confirmText: 'Delete Permanently',
        showSoftDeleteOption: true,
      },
      edit: {
        title: 'Edit Patient Details',
        message: 'You are about to modify patient information. Please ensure all changes are accurate and properly documented.',
        confirmText: 'Save Changes',
        showSoftDeleteOption: false,
      },
      archive: {
        title: 'Archive Patient Record',
        message: 'This will mark the patient as inactive. The record will be preserved but hidden from active lists.',
        confirmText: 'Archive Patient',
        showSoftDeleteOption: false,
      },
    };
    return configs[modalConfig.type] || configs.delete;
  };

  return (
    <div className="patient-management p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Patient Management</h2>
        <p className="text-gray-600">Manage patient records, medical history, and demographics</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingId ? 'Edit Patient' : 'Add New Patient'}
              </h3>
              {showForm && (
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
              >
                + New Patient
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Form fields remain the same */}
                {/* ... (keep all your existing form fields) ... */}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">NIN</label>
                  <input
                    type="text"
                    name="nin"
                    value={formData.nin}
                    onChange={handleChange}
                    placeholder="National Identity Number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Blood Type</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tribe/Ethnicity</label>
                  <select
                    name="tribe"
                    value={formData.tribe}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Tribe</option>
                    {tribes.map(tribe => (
                      <option key={tribe} value={tribe}>{tribe}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!formData.country || loadingData}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">
                      {!formData.country ? 'Select Country first' : loadingData ? 'Loading states...' : 'Select State'}
                    </option>
                    {nigerianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {formData.country === 'Nigeria' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Local Government Area</label>
                    <select
                      name="lga"
                      value={formData.lga}
                      onChange={handleChange}
                      disabled={!formData.state}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">
                        {formData.state ? 'Select LGA' : 'Select State first'}
                      </option>
                      {availableLGAs.map(lga => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    rows="3"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
                  >
                    {editingId ? 'Update' : 'Add'} Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Patient List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Patient List</h3>

            {/* Search, Sort, and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search by name, NIN, phone, or email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={handleSort}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="date">Date Added (Newest)</option>
                  <option value="state">State (A-Z)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by State</label>
                <select
                  value={filterBy}
                  onChange={handleFilter}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All States</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Records Table */}
            <div className="overflow-x-auto">
              {filteredPatients.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  {filteredPatients.length === 0 && searchTerm
                    ? 'No patients match your search.'
                    : 'No patients added yet. Click "New Patient" to get started.'}
                </p>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">NIN</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">State</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Blood Type</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedPatients.map(patient => (
                      <tr key={patient.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{patient.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.nin || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.state || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.bloodType || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {patient.status || 'active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm space-x-2">
                          <button
                            onClick={() => handleEditClick(patient)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(patient)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Summary */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
              Showing {displayedPatients.length} of {totalItems} patient(s)
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        onSoftDelete={() => handleSoftDelete(modalConfig.patientData)}
        type={modalConfig.type}
        patientData={modalConfig.patientData}
        title={getModalConfig().title}
        message={getModalConfig().message}
        confirmText={getModalConfig().confirmText}
        showSoftDeleteOption={getModalConfig().showSoftDeleteOption}
      />
    </div>
  );
};

export default PatientManagement;