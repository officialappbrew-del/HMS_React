import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  addStaff,
  updateStaff,
  deleteStaff,
  searchStaff,
  sortStaff,
  filterStaff,
} from '../features/staffSlice.jsx';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const StaffManagement = () => {
  const dispatch = useDispatch();
  const { filteredStaff, searchTerm, sortBy, filterBy } = useSelector(
    state => state.staff
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    hireDate: '',
    salary: '',
  });

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    staffData: null,
    action: null,
  });

  const roles = ['Chief Medical Officer', 'Doctor', 'Surgeon', 'Registered Nurse', 'Nurse', 'Pharmacist', 'Lab Technician', 'Administrator', 'Receptionist', 'Cleaner', 'Security'];
  const departments = ['Administration', 'General Medicine', 'Surgery', 'Pediatrics', 'Obstetrics & Gynecology', 'Emergency', 'Pharmacy', 'Laboratory', 'Radiology', 'Cardiology', 'Neurology', 'Orthopedics'];

  // Handlers for search, sort, filter
  const handleSearch = (e) => dispatch(searchStaff(e.target.value));
  const handleSort = (e) => dispatch(sortStaff(e.target.value));
  const handleFilter = (e) => dispatch(filterStaff(e.target.value));

  // Open modal for delete
  const handleDeleteClick = (staff) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      staffData: staff,
      action: () => dispatch(deleteStaff(staff.id)),
    });
  };

  // Archive functionality removed - not implemented in slice

  // Open modal for edit
  const handleEditClick = (staff) => {
    setModalConfig({
      isOpen: true,
      type: 'edit',
      staffData: staff,
      action: () => {
        setFormData(staff);
        setEditingId(staff.id);
        setShowForm(true);
      },
    });
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
    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      alert('Name, Email, and Role are required fields');
      return;
    }

    if (editingId) {
      dispatch(updateStaff({ ...formData, id: editingId }));
      setEditingId(null);
    } else {
      const newStaff = {
        ...formData,
        id: Date.now(),
        status: 'active',
      };
      dispatch(addStaff(newStaff));
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      hireDate: '',
      salary: '',
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calculate pagination
  const totalItems = filteredStaff.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedStaff = filteredStaff.slice(startIndex, endIndex);

  // Get modal configuration based on type
  const getModalConfig = () => {
    const configs = {
      delete: {
        title: 'Delete Staff Record',
        message: 'Are you sure you want to permanently delete this staff record? This action is irreversible and will remove all associated data.',
        confirmText: 'Delete Permanently',
        showSoftDeleteOption: false,
      },
      edit: {
        title: 'Edit Staff Details',
        message: 'You are about to modify staff information. Please ensure all changes are accurate and properly documented.',
        confirmText: 'Save Changes',
        showSoftDeleteOption: false,
      },
      archive: {
        title: 'Archive Staff Record',
        message: 'This will mark the staff member as inactive. The record will be preserved but hidden from active lists.',
        confirmText: 'Archive Staff',
        showSoftDeleteOption: false,
      },
    };
    return configs[modalConfig.type] || configs.delete;
  };

  return (
    <div className="staff-management p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Staff Management</h2>
        <p className="text-gray-600">Manage medical staff records, roles, and departments</p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingId ? 'Edit Staff' : 'Add New Staff'}
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
                + New Staff Member
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Salary (₦)</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g., 150000"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
                  >
                    {editingId ? 'Update' : 'Add'} Staff
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

        {/* Staff List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Staff List</h3>

            {/* Search, Sort, and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search by name, email, role, or department..."
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
                  <option value="name">Name</option>
                  <option value="role">Role</option>
                  <option value="department">Department</option>
                  <option value="hireDate">Hire Date</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter By Status</label>
                <select
                  value={filterBy}
                  onChange={handleFilter}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Staff</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Staff Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                            <div className="text-sm text-gray-500">{staff.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{staff.role}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{staff.department}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(staff)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleArchiveClick(staff)}
                          className="text-orange-600 hover:text-orange-900 mr-3"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleDeleteClick(staff)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {displayedStaff.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No staff members found
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        config={getModalConfig()}
        data={modalConfig.staffData}
      />
    </div>
  );
};

export default StaffManagement;