import { 
  BeakerIcon, 
  ClipboardDocumentListIcon, 
  TruckIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DeviceTabletIcon,
  WrenchIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  UserIcon,
  BellAlertIcon,
  DocumentCheckIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PaperAirplaneIcon,
  PrinterIcon,
  EnvelopeIcon,
  PhoneIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const Laboratory = () => {
  // State for interactive components
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Critical result for PID-2301-0456', type: 'critical', time: '5 min ago' },
    { id: 2, message: 'Instrument calibration completed', type: 'info', time: '15 min ago' },
    { id: 3, message: 'NAFDAC expiry alert: 3 items', type: 'warning', time: '1 hour ago' }
  ]);
  const [stats, setStats] = useState({
    pendingSamples: 142,
    completedTests: 387,
    criticalResults: 9,
    ncdcPending: 3
  });

  // Dummy data for tables
  const dummyCriticalResults = [
    { id: 1, patientId: 'PID-2301-0456', name: 'Adeola Yusuf', test: 'Potassium', value: '6.8 mmol/L', reference: '3.5-5.1', since: '45 min ago', physician: 'Dr. Ahmed', status: 'awaiting' },
    { id: 2, patientId: 'PID-2301-0457', name: 'Chinedu Okoro', test: 'Blood Glucose', value: '25.3 mmol/L', reference: '3.9-6.1', since: '32 min ago', physician: 'Dr. Ibrahim', status: 'notified' },
    { id: 3, patientId: 'PID-2301-0458', name: 'Funke Adebayo', test: 'Hemoglobin', value: '5.2 g/dL', reference: '12.0-16.0', since: '18 min ago', physician: 'Dr. Okafor', status: 'awaiting' }
  ];

  const dummyWorkInProgress = [
    { id: 1, accession: 'ACC-2026-01234', patient: 'Amina Bello', tests: ['FBC', 'LFT', 'RFT'], collection: '08:45 AM', station: 'Chemistry Analyzer', tat: '3h 15m', tech: 'Tech. Ahmed', priority: 'routine' },
    { id: 2, accession: 'ACC-2026-01235', patient: 'John Chukwu', tests: ['Malaria RDT', 'Troponin'], collection: '09:15 AM', station: 'Serology Station', tat: '45m', tech: 'Tech. Fatima', priority: 'stat' },
    { id: 3, accession: 'ACC-2026-01236', patient: 'Sarah Johnson', tests: ['HIV Viral Load', 'CD4 Count'], collection: '07:30 AM', station: 'Molecular Lab', tat: '6h 30m', tech: 'Tech. Emeka', priority: 'priority' }
  ];

  // Dummy function handlers
  const handleNewTestRequest = () => {
    setIsLoading(true);
    console.log('API: Creating new test request...');
    
    // Simulate API call
    setTimeout(() => {
      alert('New test request created successfully!\n\nPatient: Demo Patient\nTests: CBC, LFT\nPriority: Routine');
      setIsLoading(false);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingSamples: prev.pendingSamples + 1
      }));
      
      // Add notification
      setNotifications(prev => [
        { id: Date.now(), message: 'New test request created for Demo Patient', type: 'info', time: 'Just now' },
        ...prev
      ]);
    }, 1000);
  };

  const handleRegisterSamples = () => {
    setIsLoading(true);
    console.log('API: Registering new samples...');
    
    setTimeout(() => {
      const sampleCount = Math.floor(Math.random() * 5) + 1;
      alert(`${sampleCount} sample(s) registered successfully!\nAccession numbers: ACC-${Date.now().toString().slice(-6)}`);
      setIsLoading(false);
      
      setStats(prev => ({
        ...prev,
        pendingSamples: prev.pendingSamples + sampleCount
      }));
    }, 800);
  };

  const handleViewAll = (section) => {
    console.log(`API: Loading all ${section}...`);
    alert(`Loading all ${section}...\n\nThis would navigate to the detailed ${section} view in a real application.`);
  };

  const handleEscalateCritical = (patientId) => {
    console.log(`API: Escalating critical result for ${patientId}...`);
    
    // Find and update the status
    const updatedResults = dummyCriticalResults.map(result => 
      result.patientId === patientId 
        ? { ...result, status: 'escalated' }
        : result
    );
    
    alert(`Critical result for ${patientId} has been escalated to the Medical Director.\n\nEscalation protocol initiated.`);
    
    setNotifications(prev => [
      { id: Date.now(), message: `Critical result escalated for ${patientId}`, type: 'warning', time: 'Just now' },
      ...prev
    ]);
  };

  const handleAcknowledgeCritical = (patientId) => {
    console.log(`API: Acknowledging critical result for ${patientId}...`);
    alert(`Critical result for ${patientId} acknowledged by physician.\n\nStatus updated in system.`);
    
    setStats(prev => ({
      ...prev,
      criticalResults: prev.criticalResults - 1
    }));
  };

  const handleSubmitNCDC = () => {
    setIsLoading(true);
    console.log('API: Submitting NCDC reports...');
    
    setTimeout(() => {
      alert('NCDC reports submitted successfully!\n\n• Lassa Fever: 1 case\n• Cholera: 1 case\n• Yellow Fever: 1 case\n\nSubmission ID: NCDC-2026-00123');
      setIsLoading(false);
      
      setStats(prev => ({
        ...prev,
        ncdcPending: 0
      }));
    }, 1500);
  };

  const handlePrintReport = (accession) => {
    console.log(`API: Printing report for ${accession}...`);
    alert(`Printing report for ${accession}...\n\nReport sent to default printer.\n\nFormat: A4 with hospital letterhead`);
  };

  const handleExportData = (format) => {
    setIsLoading(true);
    console.log(`API: Exporting data as ${format}...`);
    
    setTimeout(() => {
      alert(`Data exported successfully as ${format.toUpperCase()}!\n\nFile: lab_data_export_${new Date().toISOString().split('T')[0]}.${format}\nSize: ~2.5 MB\nDownload will start automatically.`);
      setIsLoading(false);
    }, 1200);
  };

  const handleSendSMS = (patientId) => {
    console.log(`API: Sending SMS to patient ${patientId}...`);
    alert(`SMS notification sent to patient ${patientId}.\n\nMessage: "Your lab results are ready. Please visit the hospital to collect your report."`);
  };

  const handleBulkAction = (action) => {
    if (selectedSamples.length === 0) {
      alert('Please select samples first by clicking on the checkboxes.');
      return;
    }
    
    console.log(`API: Performing ${action} on ${selectedSamples.length} samples...`);
    
    switch(action) {
      case 'verify':
        alert(`${selectedSamples.length} samples marked as verified.`);
        break;
      case 'reject':
        const reason = prompt('Enter rejection reason:', 'Hemolyzed sample');
        if (reason) {
          alert(`${selectedSamples.length} samples rejected. Reason: ${reason}`);
        }
        break;
      case 'print':
        alert(`Printing ${selectedSamples.length} sample labels...`);
        break;
    }
  };

  const handleMaintenanceRequest = (instrument) => {
    console.log(`API: Creating maintenance request for ${instrument}...`);
    
    const priority = instrument.includes('Offline') ? 'HIGH' : 'MEDIUM';
    alert(`Maintenance request created for ${instrument}.\n\nPriority: ${priority}\nTicket #: MNT-${Date.now().toString().slice(-6)}\nTechnician will be notified.`);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
    console.log('Filters toggled:', !showFilters);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log('Tab changed to:', tab);
  };

  const handleSampleSelection = (sampleId) => {
    setSelectedSamples(prev => 
      prev.includes(sampleId)
        ? prev.filter(id => id !== sampleId)
        : [...prev, sampleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSamples.length === dummyWorkInProgress.length) {
      setSelectedSamples([]);
    } else {
      setSelectedSamples(dummyWorkInProgress.map(sample => sample.id));
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update stats for demo purposes
      setStats(prev => ({
        ...prev,
        completedTests: prev.completedTests + Math.floor(Math.random() * 3),
        pendingSamples: Math.max(0, prev.pendingSamples - Math.floor(Math.random() * 2))
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="laboratory min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header with Quick Actions - NOW INTERACTIVE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Laboratory Management System</h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">
            Comprehensive LIS for Nigerian healthcare facilities | MLSCN Compliant | NCDC Integrated
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleNewTestRequest}
            disabled={isLoading}
            className={`px-4 py-2 ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white text-sm font-medium rounded-lg flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                New Test Request
              </>
            )}
          </button>
          <button 
            onClick={handleRegisterSamples}
            disabled={isLoading}
            className={`px-4 py-2 ${isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white text-sm font-medium rounded-lg flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            <TruckIcon className="h-4 w-4 mr-2" />
            Register Samples
          </button>
          <button 
            onClick={handleFilterToggle}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center transition-colors"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters {showFilters ? '(On)' : ''}
          </button>
          <button 
            onClick={() => handleExportData('csv')}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filter Panel (Conditional) */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Advanced Filters</h3>
            <button 
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Today</option>
                <option>Last 7 days</option>
                <option>This month</option>
                <option>Custom range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>All Tests</option>
                <option>Hematology</option>
                <option>Chemistry</option>
                <option>Microbiology</option>
                <option>Serology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>All Status</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Bar */}
      {notifications.length > 0 && (
        <div className="mb-6 bg-white rounded-xl shadow border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 overflow-x-auto">
              {notifications.slice(0, 3).map(notif => (
                <div 
                  key={notif.id}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm min-w-fit ${
                    notif.type === 'critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                    notif.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  <BellAlertIcon className="h-4 w-4 mr-2" />
                  <span>{notif.message}</span>
                  <span className="ml-2 text-xs opacity-75">{notif.time}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setNotifications([])}
              className="text-gray-500 hover:text-gray-700 text-sm whitespace-nowrap ml-2"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          {['dashboard', 'samples', 'results', 'qc', 'inventory', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? 'bg-white border-t border-l border-r border-gray-200 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main KPI Dashboard - NOW INTERACTIVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div 
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer"
          onClick={() => handleViewAll('pending samples')}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Samples</p>
              <p className="text-2xl md:text-3xl font-bold text-indigo-600 mt-1">{stats.pendingSamples}</p>
            </div>
            <div className="relative">
              <TruckIcon className="h-10 w-10 text-indigo-500 opacity-70" />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                5
              </span>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>Avg wait: 1h 24m • </span>
            <span className="ml-2 text-green-600">↑ 18% from yesterday</span>
          </div>
        </div>

        <div 
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:border-green-200 transition-colors cursor-pointer"
          onClick={() => handleViewAll('completed tests')}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Tests Completed Today</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600 mt-1">{stats.completedTests}</p>
            </div>
            <BeakerIcon className="h-10 w-10 text-green-500 opacity-70" />
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>Average TAT: 4h 12m • </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                alert('TAT Optimization Report:\n• Chemistry: 3h 45m\n• Hematology: 2h 15m\n• Microbiology: 18h 30m');
              }}
              className="ml-2 text-blue-600 hover:underline font-medium"
            >
              View Details
            </button>
          </div>
        </div>

        <div 
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:border-red-200 transition-colors cursor-pointer"
          onClick={() => handleViewAll('critical results')}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Critical Results</p>
              <p className="text-2xl md:text-3xl font-bold text-red-600 mt-1">{stats.criticalResults}</p>
            </div>
            <div className="relative">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-500 opacity-70" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {dummyCriticalResults.filter(r => r.status === 'awaiting').length}
              </span>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>{dummyCriticalResults.filter(r => r.status === 'awaiting').length} unacknowledged • </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleEscalateCritical(dummyCriticalResults[0].patientId);
              }}
              className="ml-2 text-red-600 hover:underline font-medium"
            >
              Escalate now
            </button>
          </div>
        </div>

        <div 
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:border-purple-200 transition-colors cursor-pointer"
          onClick={() => handleViewAll('ncdc reports')}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-500">NCDC Notifiable Pending</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-1">{stats.ncdcPending}</p>
            </div>
            <DocumentTextIcon className="h-10 w-10 text-purple-500 opacity-70" />
          </div>
          <div className="text-xs text-gray-500">
            Lassa (1), Cholera (1), Yellow Fever (1)
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSubmitNCDC();
              }}
              className="ml-2 text-purple-600 hover:underline font-medium block mt-1"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit now →'}
            </button>
          </div>
        </div>
      </div>

      {/* 🚨 CRITICAL ALERTS SECTION - NOW INTERACTIVE */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <BellAlertIcon className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-800">Critical Results Requiring Immediate Action</h3>
              <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">{dummyCriticalResults.length}</span>
            </div>
            <button 
              onClick={() => handleViewAll('critical results')}
              className="text-sm text-red-700 hover:text-red-900 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-red-100">
              <thead>
                <tr className="text-xs text-red-700 bg-red-50">
                  <th className="py-2 px-3 text-left">Patient ID</th>
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left">Critical Test</th>
                  <th className="py-2 px-3 text-left">Value</th>
                  <th className="py-2 px-3 text-left">Reference</th>
                  <th className="py-2 px-3 text-left">Critical Since</th>
                  <th className="py-2 px-3 text-left">Physician</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-50">
                {dummyCriticalResults.map(result => (
                  <tr key={result.id} className="hover:bg-red-50">
                    <td className="py-3 px-3 text-sm">{result.patientId}</td>
                    <td className="py-3 px-3 text-sm font-medium">{result.name}</td>
                    <td className="py-3 px-3 text-sm">
                      <span className="inline-flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-1" />
                        {result.test}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm font-bold text-red-600">{result.value}</td>
                    <td className="py-3 px-3 text-sm text-gray-600">{result.reference}</td>
                    <td className="py-3 px-3 text-sm">{result.since}</td>
                    <td className="py-3 px-3 text-sm">{result.physician}</td>
                    <td className="py-3 px-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        result.status === 'awaiting' ? 'bg-red-100 text-red-800' :
                        result.status === 'notified' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {result.status === 'awaiting' ? 'Awaiting ACK' :
                         result.status === 'notified' ? 'MD Notified' : 'Acknowledged'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm">
                      <button 
                        onClick={() => handleEscalateCritical(result.patientId)}
                        className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mr-2"
                      >
                        <PhoneIcon className="h-3 w-3 inline mr-1" />
                        Call MD
                      </button>
                      <button 
                        onClick={() => handleAcknowledgeCritical(result.patientId)}
                        className="text-xs border border-green-600 text-green-600 px-3 py-1 rounded hover:bg-green-50"
                      >
                        <CheckCircleIcon className="h-3 w-3 inline mr-1" />
                        Ack
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-red-600 flex items-center">
            <InformationCircleIcon className="h-4 w-4 mr-1" />
            Critical result escalation: 15 min → Senior Tech → 30 min → Lab Manager → 60 min → Medical Director
          </div>
        </div>
      </div>

      {/* 📊 WORK IN PROGRESS TABLE - NOW INTERACTIVE */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-amber-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Work in Progress ({dummyWorkInProgress.length} samples)</h3>
              <p className="text-sm text-gray-600">Real-time sample tracking across workflow stations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              onChange={(e) => console.log('Filter by station:', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>All Stations</option>
              <option>Receiving</option>
              <option>Centrifugation</option>
              <option>Chemistry</option>
              <option>Hematology</option>
              <option>Microbiology</option>
              <option>Reporting</option>
            </select>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleBulkAction('verify')}
                className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
              >
                <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                Verify
              </button>
              <button 
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                <XCircleIcon className="h-4 w-4 inline mr-1" />
                Reject
              </button>
              <button 
                onClick={() => handleBulkAction('print')}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <PrinterIcon className="h-4 w-4 inline mr-1" />
                Print
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-xs text-gray-500 bg-gray-50">
                <th className="py-3 px-3 text-left font-medium">
                  <input 
                    type="checkbox"
                    checked={selectedSamples.length === dummyWorkInProgress.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="py-3 px-3 text-left font-medium">Accession #</th>
                <th className="py-3 px-3 text-left font-medium">Patient</th>
                <th className="py-3 px-3 text-left font-medium">Tests</th>
                <th className="py-3 px-3 text-left font-medium">Collection</th>
                <th className="py-3 px-3 text-left font-medium">Current Station</th>
                <th className="py-3 px-3 text-left font-medium">TAT Status</th>
                <th className="py-3 px-3 text-left font-medium">Technologist</th>
                <th className="py-3 px-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dummyWorkInProgress.map(sample => (
                <tr key={sample.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 text-sm">
                    <input 
                      type="checkbox"
                      checked={selectedSamples.includes(sample.id)}
                      onChange={() => handleSampleSelection(sample.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-3 px-3 text-sm font-mono">{sample.accession}</td>
                  <td className="py-3 px-3 text-sm">
                    <div className="font-medium">{sample.patient}</div>
                    <div className="text-xs text-gray-500">PID: {sample.id.toString().padStart(4, '0')}</div>
                  </td>
                  <td className="py-3 px-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {sample.tests.map((test, idx) => (
                        <span 
                          key={idx}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                          onClick={() => alert(`Test Details: ${test}\nSample: ${sample.accession}\nStatus: In Progress`)}
                        >
                          {test}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm">
                    <div>{sample.collection}</div>
                    <div className="text-xs text-gray-500">Ward A3</div>
                  </td>
                  <td className="py-3 px-3 text-sm">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        sample.station.includes('Chemistry') ? 'bg-green-500' :
                        sample.station.includes('Serology') ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <span>{sample.station}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${
                            sample.priority === 'stat' ? 'bg-red-600' :
                            sample.priority === 'priority' ? 'bg-blue-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: sample.priority === 'stat' ? '30%' : sample.priority === 'priority' ? '60%' : '75%' }}
                        ></div>
                      </div>
                      <span className={`text-xs ${
                        sample.priority === 'stat' ? 'text-red-600' :
                        sample.priority === 'priority' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {sample.tat} {sample.priority === 'stat' ? '/ STAT' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm">{sample.tech}</td>
                  <td className="py-3 px-3 text-sm">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handlePrintReport(sample.accession)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Print Report"
                      >
                        <PrinterIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleSendSMS(sample.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Send SMS"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleViewAll('sample details')}
                        className="text-gray-600 hover:text-gray-800"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={() => handleViewAll('all samples')}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center mx-auto"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Load more samples (120 remaining)
          </button>
        </div>
      </div>

      {/* Core Functionality Grid - NOW INTERACTIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
        {/* Sample & Workflow Management */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Sample Management</h3>
                <p className="text-sm text-gray-600">End-to-end sample lifecycle tracking</p>
              </div>
            </div>
            <button 
              onClick={() => handleViewAll('sample management')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </button>
          </div>
          <ul className="space-y-3 text-gray-700">
            {[
              { title: 'Sample registration & accessioning', desc: 'With barcode/QR generation and printing' },
              { title: 'Collection site tracking & chain of custody', desc: 'GPS-enabled for mobile phlebotomy' },
              { title: 'Real-time sample status', desc: 'Received → Processing → Analysis → Verification → Archived' },
              { title: 'Rejection workflow with reasons', desc: 'Hemolyzed, clotted, QNS, wrong container + photographic evidence' },
              { title: 'Sample storage & retrieval', desc: 'Freezer/rack/shelf/position management with temperature monitoring' }
            ].map((item, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{item.title}</span>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Today's collections:</span>
              <span className="font-medium">87 samples • 3 rejected</span>
            </div>
            <div className="mt-2 flex space-x-2">
              <button 
                onClick={() => alert('Viewing rejected samples...')}
                className="text-xs text-red-600 hover:text-red-800"
              >
                View Rejected
              </button>
              <button 
                onClick={() => alert('Generating collection report...')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Test & Results Management */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-teal-100 p-2 rounded-lg mr-3">
                <BeakerIcon className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Test & Results Management</h3>
                <p className="text-sm text-gray-600">Comprehensive test processing workflow</p>
              </div>
            </div>
            <button 
              onClick={() => handleViewAll('test management')}
              className="text-sm text-teal-600 hover:text-teal-800 font-medium"
            >
              View All →
            </button>
          </div>
          <ul className="space-y-3 text-gray-700">
            {[
              { title: 'Test ordering from EMR/standalone', desc: 'Integration with hospital EMR systems' },
              { title: 'Test catalog with profiles/panels', desc: 'Hematology, Chemistry, Microbiology, Serology, Molecular' },
              { title: 'Automated/manual result entry', desc: 'Bi-directional instrument integration (HL7, ASTM)' },
              { title: 'Nigerian reference ranges', desc: 'Age, sex, pregnancy, ethnicity-specific ranges' },
              { title: 'Critical/abnormal flagging', desc: 'With automated alert system and escalation matrix' },
              { title: 'Result approval workflow', desc: 'Electronic signature, two-level verification for critical tests' }
            ].map((item, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{item.title}</span>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button 
              onClick={() => alert('Opening test catalog...')}
              className="w-full bg-teal-50 text-teal-700 border border-teal-200 rounded-lg py-2 text-sm font-medium hover:bg-teal-100 transition-colors"
            >
              Browse Test Catalog →
            </button>
          </div>
        </div>
      </div>

      {/* 🛠️ INSTRUMENT DASHBOARD - NOW INTERACTIVE */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-cyan-100 p-2 rounded-lg mr-3">
              <WrenchIcon className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Instrument Dashboard</h3>
              <p className="text-sm text-gray-600">Real-time status of laboratory equipment</p>
            </div>
          </div>
          <button 
            onClick={() => handleViewAll('maintenance log')}
            className="text-sm text-cyan-600 hover:text-cyan-800 font-medium"
          >
            Maintenance Log →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Abbott Architect c16000', status: 'online', type: 'Chemistry Analyzer', testsPerHour: 1200, uptime: 99.2, nextMaintenance: 14 },
            { name: 'Sysmex XN-1000', status: 'calibrating', type: 'Hematology Analyzer', testsPerHour: 180, uptime: 97.8, nextMaintenance: 0 },
            { name: 'Roche Cobas 6800', status: 'online', type: 'Molecular System', testsPerHour: 144, uptime: 98.5, nextMaintenance: 21 },
            { name: 'BD BACTEC FX40', status: 'offline', type: 'Microbiology System', testsPerHour: 96, uptime: 95.1, nextMaintenance: -3 }
          ].map((instrument, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-800">{instrument.name}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  instrument.status === 'online' ? 'bg-green-100 text-green-800' :
                  instrument.status === 'calibrating' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {instrument.status === 'online' ? 'Online' :
                   instrument.status === 'calibrating' ? 'Calibrating' : 'Offline'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{instrument.type}</div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Tests/hr: {instrument.testsPerHour.toLocaleString()}</span>
                <span>Uptime: {instrument.uptime}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                <div 
                  className={`h-1.5 rounded-full ${
                    instrument.status === 'online' ? 'bg-green-600' :
                    instrument.status === 'calibrating' ? 'bg-yellow-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${instrument.status === 'offline' ? 0 : 75}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${
                  instrument.nextMaintenance <= 0 ? 'text-red-600' :
                  instrument.nextMaintenance <= 7 ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {instrument.nextMaintenance <= 0 
                    ? 'Maintenance overdue!' 
                    : `Next maintenance: ${instrument.nextMaintenance} days`}
                </span>
                <button 
                  onClick={() => handleMaintenanceRequest(instrument.name)}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Modules Grid - NOW INTERACTIVE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div 
          className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow text-center hover:border-indigo-200 cursor-pointer"
          onClick={() => handleViewAll('staff management')}
        >
          <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <UserGroupIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">Staff & Access Management</h4>
          <p className="text-sm text-gray-600 mb-3">Roles, shifts, competency tracking, electronic sign-off</p>
          <div className="text-xs text-gray-500">
            <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">12 on duty</span>
            <span className="inline-block bg-gray-100 px-2 py-1 rounded">3 shifts</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              alert('Opening staff schedule...');
            }}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View Schedule →
          </button>
        </div>

        <div 
          className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow text-center hover:border-teal-200 cursor-pointer"
          onClick={() => handleViewAll('inventory')}
        >
          <div className="bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <ClipboardDocumentListIcon className="h-8 w-8 text-teal-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">Reagents & Inventory</h4>
          <p className="text-sm text-gray-600 mb-3">Stock levels, expiry alerts, NAFDAC compliance, auto-reorder</p>
          <div className="text-xs text-gray-500">
            <span 
              onClick={(e) => {
                e.stopPropagation();
                alert('Expiring items:\n• HIV Rapid Test Kits (7 days)\n• Malaria RDTs (14 days)\n• Blood Culture Bottles (21 days)');
              }}
              className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded mr-2 cursor-pointer hover:bg-amber-200"
            >
              8 expiring soon
            </span>
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded cursor-pointer hover:bg-red-200">
              2 low stock
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              alert('Placing reorder request...');
            }}
            className="mt-3 text-sm text-teal-600 hover:text-teal-800 font-medium"
          >
            Reorder Supplies →
          </button>
        </div>

        <div 
          className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow text-center hover:border-purple-200 cursor-pointer"
          onClick={() => handleViewAll('billing')}
        >
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">Billing & Financial Management</h4>
          <p className="text-sm text-gray-600 mb-3">Test pricing, NHIS integration, invoices, mobile money payments</p>
          <div className="text-xs text-gray-500">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">₦4.8M monthly</span>
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">96% NHIS rate</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              alert('Generating monthly revenue report...');
            }}
            className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            View Reports →
          </button>
        </div>
      </div>

      {/* System Controls */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Controls</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => alert('System refresh initiated...')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh Data
          </button>
          <button 
            onClick={() => handleExportData('pdf')}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium flex items-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export as PDF
          </button>
          <button 
            onClick={() => handleExportData('excel')}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium flex items-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export as Excel
          </button>
          <button 
            onClick={() => alert('Opening system settings...')}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium flex items-center"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            System Settings
          </button>
          <button 
            onClick={() => {
              const confirmed = window.confirm('Are you sure you want to reset all filters and selections?');
              if (confirmed) {
                setSelectedSamples([]);
                setShowFilters(false);
                alert('All filters and selections have been reset.');
              }
            }}
            className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 text-sm font-medium flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Reset All
          </button>
        </div>
      </div>

      {/* Footer & System Status */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500">
              Laboratory Management Module v1.2 • MLSCN Compliant • NCDC Integrated
              <br />
              <span className="text-xs text-gray-400">
                Demo Mode Active • All actions are simulated • API integration pending
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Systems: 14/16 Online</span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
            <InformationCircleIcon className="h-3 w-3 mr-1" />
            Demo Mode: All buttons are functional with simulated API responses
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laboratory;