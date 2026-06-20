import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  FileText,
  Pill,
  CreditCard,
  BookOpen,
  Video,
  Bell,
  Settings,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';
import {
  registerPatient,
  updatePatientProfile,
  bookAppointment,
  cancelAppointment,
  requestPrescriptionRefill,
  viewTestResults,
  makePayment,
  bookTelemedicineSession,
  markNotificationRead,
  submitFeedback,
  searchPortal,
  sortPortal,
  filterPortal
} from '../features/patientPortalSlice';
import Pagination from '../components/Pagination';

const PatientPortal = () => {
  const dispatch = useDispatch();
  const {
    patients,
    appointments,
    medicalRecords,
    prescriptions,
    testResults,
    bills,
    payments,
    healthEducation,
    telemedicineSessions,
    notifications,
    healthTopics,
    availableSlots,
    searchTerm,
    sortBy,
    filterBy
  } = useSelector(state => state.patientPortal);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [appointmentForm, setAppointmentForm] = useState({
    department: '',
    doctor: '',
    dateTime: '',
    reason: '',
    urgency: 'routine'
  });

  const [paymentForm, setPaymentForm] = useState({
    billId: '',
    amount: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [telemedicineForm, setTelemedicineForm] = useState({
    specialty: '',
    dateTime: '',
    reason: '',
    symptoms: ''
  });

  // Mock current patient (in real app, this would come from auth)
  useEffect(() => {
    if (patients.length === 0) {
      // Create a demo patient
      dispatch(registerPatient({
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+2348012345678',
        dateOfBirth: '1985-05-15',
        gender: 'male',
        address: 'Lagos, Nigeria'
      }));
    }
    setCurrentPatient(patients[0]);
  }, [patients, dispatch]);

  // Filter and search logic
  const filteredAppointments = appointments
    .filter(apt => {
      const matchesSearch = !searchTerm ||
        apt.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.department?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || apt.status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.dateTime) - new Date(a.dateTime);
      if (sortBy === 'department') return a.department?.localeCompare(b.department);
      return 0;
    });

  const filteredBills = bills
    .filter(bill => {
      const matchesSearch = !searchTerm ||
        bill.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || bill.status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedItems = activeTab === 'appointments' ? filteredAppointments : filteredBills;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!currentPatient) return;

    dispatch(bookAppointment({
      ...appointmentForm,
      patientId: currentPatient.id,
      patientName: currentPatient.name
    }));

    setAppointmentForm({
      department: '',
      doctor: '',
      dateTime: '',
      reason: '',
      urgency: 'routine'
    });
    setShowAppointmentModal(false);
  };

  const handleMakePayment = (e) => {
    e.preventDefault();
    if (!currentPatient) return;

    dispatch(makePayment({
      ...paymentForm,
      patientId: currentPatient.id,
      patientName: currentPatient.name
    }));

    setPaymentForm({
      billId: '',
      amount: '',
      paymentMethod: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
    setShowPaymentModal(false);
  };

  const handleBookTelemedicine = (e) => {
    e.preventDefault();
    if (!currentPatient) return;

    dispatch(bookTelemedicineSession({
      ...telemedicineForm,
      patientId: currentPatient.id,
      patientName: currentPatient.name
    }));

    setTelemedicineForm({
      specialty: '',
      dateTime: '',
      reason: '',
      symptoms: ''
    });
    setShowTelemedicineModal(false);
  };

  const handleCancelAppointment = (appointmentId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      dispatch(cancelAppointment({ appointmentId, reason }));
    }
  };

  const handleMarkNotificationRead = (notificationId) => {
    dispatch(markNotificationRead(notificationId));
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentPatient) {
    return (
      <div className="patient-portal p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">Loading Patient Portal...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-portal p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <User className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
              Patient Portal
            </h1>
            <p className="text-gray-600 mt-2">Welcome back, {currentPatient.name}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-800 relative">
                <Bell className="w-6 h-6" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: User },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'records', label: 'Medical Records', icon: FileText },
            { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
            { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
            { id: 'telemedicine', label: 'Telemedicine', icon: Video },
            { id: 'education', label: 'Health Education', icon: BookOpen }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex flex-col items-center"
                >
                  <Calendar className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Book Appointment</span>
                </button>

                <button
                  onClick={() => setShowTelemedicineModal(true)}
                  className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 flex flex-col items-center"
                >
                  <Video className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Telemedicine</span>
                </button>

                <button
                  onClick={() => setActiveTab('records')}
                  className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex flex-col items-center"
                >
                  <FileText className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">View Records</span>
                </button>

                <button
                  onClick={() => setActiveTab('billing')}
                  className="p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex flex-col items-center"
                >
                  <CreditCard className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Pay Bills</span>
                </button>
              </div>
            </div>

            {/* Recent Activity & Notifications */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.slice(0, 5).map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString('en-NG')}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkNotificationRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm ml-2"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No notifications yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchPortal(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterPortal(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Appointments</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(sortPortal(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Date</option>
                  <option value="department">Department</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {paginatedData.map(appointment => (
                <div key={appointment.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{appointment.doctor}</h4>
                      <p className="text-sm text-gray-600">{appointment.department}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Date & Time</p>
                      <p className="text-sm">{new Date(appointment.dateTime).toLocaleString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reason</p>
                      <p className="text-sm">{appointment.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Urgency</p>
                      <p className="text-sm capitalize">{appointment.urgency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Booked</p>
                      <p className="text-sm">{new Date(appointment.bookedAt).toLocaleDateString('en-NG')}</p>
                    </div>
                  </div>

                  {appointment.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {paginatedData.length === 0 && (
                <p className="text-gray-500 text-center py-8">No appointments found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Medical Records</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test Results */}
              <div>
                <h4 className="font-medium mb-3">Recent Test Results</h4>
                <div className="space-y-3">
                  {testResults.slice(0, 3).map(result => (
                    <div key={result.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{result.testName}</p>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">Result: {result.result}</p>
                      <p className="text-xs text-gray-500">{new Date(result.date).toLocaleDateString('en-NG')}</p>
                    </div>
                  ))}

                  {testResults.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No test results available</p>
                  )}
                </div>
              </div>

              {/* Medical History */}
              <div>
                <h4 className="font-medium mb-3">Medical History</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="font-medium text-sm">Allergies</p>
                    <p className="text-sm text-gray-600">No known allergies</p>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="font-medium text-sm">Current Medications</p>
                    <p className="text-sm text-gray-600">No current medications</p>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="font-medium text-sm">Chronic Conditions</p>
                    <p className="text-sm text-gray-600">None reported</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Prescription Management</h3>
            <div className="space-y-4">
              {prescriptions.map(prescription => (
                <div key={prescription.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{prescription.medication}</h4>
                      <p className="text-sm text-gray-600">{prescription.dosage}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getAppointmentStatusColor(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Prescribed</p>
                      <p className="text-sm">{new Date(prescription.prescribedAt).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm">{prescription.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Refills Left</p>
                      <p className="text-sm">{prescription.refillsLeft || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Actions</p>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Request Refill
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {prescriptions.length === 0 && (
                <p className="text-gray-500 text-center py-8">No prescriptions found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bills..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchPortal(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterPortal(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Bills</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="col-span-2 flex items-end">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Make Payment
                </button>
              </div>
            </div>

            {/* Bills List */}
            <div className="space-y-4">
              {paginatedData.map(bill => (
                <div key={bill.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{bill.description}</h4>
                      <p className="text-sm text-gray-600">Bill #{bill.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{bill.amount.toLocaleString()}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getBillStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm">{new Date(bill.date).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-sm">{new Date(bill.dueDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Service</p>
                      <p className="text-sm">{bill.service}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Actions</p>
                      <div className="flex gap-1">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          <Download className="w-4 h-4" />
                        </button>
                        {bill.status !== 'paid' && (
                          <button className="text-green-600 hover:text-green-800 text-sm ml-2">
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {paginatedData.length === 0 && (
                <p className="text-gray-500 text-center py-8">No bills found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'telemedicine' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Telemedicine Sessions</h3>
              <button
                onClick={() => setShowTelemedicineModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
              >
                <Video className="w-4 h-4 mr-2" />
                Book Session
              </button>
            </div>

            <div className="space-y-4">
              {telemedicineSessions.map(session => (
                <div key={session.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{session.specialty} Consultation</h4>
                      <p className="text-sm text-gray-600">{session.reason}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getAppointmentStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Date & Time</p>
                      <p className="text-sm">{new Date(session.dateTime).toLocaleString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Meeting Link</p>
                      <a href={session.meetingLink} className="text-blue-600 hover:text-blue-800 text-sm" target="_blank" rel="noopener noreferrer">
                        Join Meeting
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Instructions</p>
                      <p className="text-sm">{session.instructions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Booked</p>
                      <p className="text-sm">{new Date(session.bookedAt).toLocaleDateString('en-NG')}</p>
                    </div>
                  </div>
                </div>
              ))}

              {telemedicineSessions.length === 0 && (
                <p className="text-gray-500 text-center py-8">No telemedicine sessions booked</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Health Education Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(healthTopics).map(([key, topic]) => (
                <div key={key} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="font-medium mb-2">{topic.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{topic.content.substring(0, 150)}...</p>

                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Key Symptoms:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {topic.symptoms?.slice(0, 3).map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Read Full Article →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'appointments' || activeTab === 'billing') && paginatedItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Appointment Booking Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </h3>
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={appointmentForm.department}
                    onChange={(e) => setAppointmentForm({...appointmentForm, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select department...</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Obstetrics">Obstetrics</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Doctor (Optional)</label>
                  <input
                    type="text"
                    value={appointmentForm.doctor}
                    onChange={(e) => setAppointmentForm({...appointmentForm, doctor: e.target.value})}
                    placeholder="Dr. Smith"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date & Time</label>
                  <select
                    value={appointmentForm.dateTime}
                    onChange={(e) => setAppointmentForm({...appointmentForm, dateTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select available slot...</option>
                    {appointmentForm.department && availableSlots[appointmentForm.department]?.map(slot => (
                      <option key={slot} value={slot}>
                        {new Date(slot).toLocaleString('en-NG')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                  <textarea
                    value={appointmentForm.reason}
                    onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                  <select
                    value={appointmentForm.urgency}
                    onChange={(e) => setAppointmentForm({...appointmentForm, urgency: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Book Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Make Payment
              </h3>
              <form onSubmit={handleMakePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bill</label>
                  <select
                    value={paymentForm.billId}
                    onChange={(e) => setPaymentForm({...paymentForm, billId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select bill...</option>
                    {bills.filter(b => b.status !== 'paid').map(bill => (
                      <option key={bill.id} value={bill.id}>
                        {bill.description} - ₦{bill.amount.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="mobile">Mobile Money</option>
                  </select>
                </div>

                {paymentForm.paymentMethod === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentForm.expiryDate}
                          onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Complete Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
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

      {/* Telemedicine Booking Modal */}
      {showTelemedicineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Book Telemedicine Session
              </h3>
              <form onSubmit={handleBookTelemedicine} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                  <select
                    value={telemedicineForm.specialty}
                    onChange={(e) => setTelemedicineForm({...telemedicineForm, specialty: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select specialty...</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Nutrition">Nutrition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date & Time</label>
                  <input
                    type="datetime-local"
                    value={telemedicineForm.dateTime}
                    onChange={(e) => setTelemedicineForm({...telemedicineForm, dateTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Consultation</label>
                  <textarea
                    value={telemedicineForm.reason}
                    onChange={(e) => setTelemedicineForm({...telemedicineForm, reason: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Symptoms</label>
                  <textarea
                    value={telemedicineForm.symptoms}
                    onChange={(e) => setTelemedicineForm({...telemedicineForm, symptoms: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Describe your symptoms..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Book Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTelemedicineModal(false)}
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
    </div>
  );
};

export default PatientPortal;