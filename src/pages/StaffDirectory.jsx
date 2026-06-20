import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  Plus,
  Users,
  Search,
  Edit,
  Trash2,
  FileText,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { addStaff, updateStaff, deleteStaff } from '../features/staffSlice';

const StaffDirectory = () => {
  const dispatch = useDispatch();
  const { staff, staffCategories, designations } = useSelector(state => state.staff);

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    specialty: '',
    registrationNumber: '',
    licenseExpiryDate: '',
    department: '',
    designation: '',
    dateOfBirth: '',
    address: ''
  });

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddStaff = () => {
    if (formData.name && formData.email && formData.category) {
      dispatch(addStaff({
        staffId: `${formData.category.substring(0, 3).toUpperCase()}${String(staff.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'Active',
        dateEmployed: new Date().toISOString().split('T')[0]
      }));
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        specialty: '',
        registrationNumber: '',
        licenseExpiryDate: '',
        department: '',
        designation: '',
        dateOfBirth: '',
        address: ''
      });
      setShowAddStaffForm(false);
    }
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDetailsModal(true);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Doctor': 'bg-blue-100 text-blue-800',
      'Nurse': 'bg-green-100 text-green-800',
      'Pharmacist': 'bg-purple-100 text-purple-800',
      'Laboratory Technician': 'bg-orange-100 text-orange-800',
      'Administrative': 'bg-gray-100 text-gray-800',
      'Support Staff': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="staff-directory p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Users className="w-8 h-8 mr-3 text-nigerian-green" />
            Staff Directory
          </h1>
          <p className="text-gray-600 mt-2">Manage hospital staff profiles and registrations</p>
        </div>
        <button
          onClick={() => setShowAddStaffForm(true)}
          className="px-6 py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Staff Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Staff</p>
              <p className="text-3xl font-bold mt-2">{staff.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Doctors</p>
              <p className="text-3xl font-bold mt-2">{staff.filter(s => s.category === 'Doctor').length}</p>
            </div>
            <FileText className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Nurses</p>
              <p className="text-3xl font-bold mt-2">{staff.filter(s => s.category === 'Nurse').length}</p>
            </div>
            <Users className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Other Staff</p>
              <p className="text-3xl font-bold mt-2">{staff.filter(s => s.category !== 'Doctor' && s.category !== 'Nurse').length}</p>
            </div>
            <Users className="w-12 h-12 text-orange-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Staff</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            >
              <option value="All">All Categories</option>
              {Object.values(staffCategories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Showing</label>
            <div className="text-2xl font-bold text-nigerian-green">{filteredStaff.length} staff members</div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="space-y-4">
        {filteredStaff.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No staff members found</p>
          </div>
        ) : (
          filteredStaff.map(staffMember => (
            <div key={staffMember.staffId} className="bg-white rounded-xl shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-bold text-lg">{staffMember.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(staffMember.category)}`}>
                    {staffMember.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold">{staffMember.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registration Number</p>
                  <p className="font-semibold text-sm">{staffMember.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(staffMember.status)}`}>
                    {staffMember.status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {staffMember.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {staffMember.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {staffMember.address}
                </div>
                <div className="text-gray-600">
                  License Expires: {new Date(staffMember.licenseExpiryDate).toLocaleDateString('en-NG')}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleViewDetails(staffMember)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Profile
                </button>
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium flex items-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Staff Modal */}
      <GenericModal
        isOpen={showAddStaffForm}
        onClose={() => setShowAddStaffForm(false)}
        title="Add Staff Member"
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            >
              <option value="">Select Category</option>
              {Object.values(staffCategories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Specialty/Designation"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
            <input
              type="text"
              placeholder="Registration Number (e.g., MDCN/2019/12345)"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              placeholder="License Expiry Date"
              value={formData.licenseExpiryDate}
              onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleAddStaff}
              className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Add Staff
            </button>
            <button
              onClick={() => setShowAddStaffForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Staff Details Modal */}
      <GenericModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedStaff(null);
        }}
        title="Staff Profile"
        size="lg"
      >
        {selectedStaff && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-bold text-lg">{selectedStaff.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Staff ID</p>
                <p className="font-bold">{selectedStaff.staffId}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-bold">{selectedStaff.category}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-bold">{selectedStaff.department}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-bold">{selectedStaff.designation}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Registration Number</p>
                <p className="font-bold text-sm">{selectedStaff.registrationNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-bold text-sm">{selectedStaff.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-bold">{selectedStaff.phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">License Expiry</p>
                <p className="font-bold">{new Date(selectedStaff.licenseExpiryDate).toLocaleDateString('en-NG')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedStaff.status)}`}>
                  {selectedStaff.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </GenericModal>
    </div>
  );
};

export default StaffDirectory;
