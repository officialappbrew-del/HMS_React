import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  addPostOpCare,
  updatePostOpCare,
  addVitalSigns,
  addPainManagement,
  dischargePatient
} from '../features/theaterSlice';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const PostOperativeCare = () => {
  const dispatch = useDispatch();
  const {
    postOpCare,
    intraOpRecords
  } = useSelector(state => state.theater);

  const { patients } = useSelector(state => state.patient);

  const [activeTab, setActiveTab] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [selectedCareId, setSelectedCareId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [vitalSignsForm, setVitalSignsForm] = useState({
    time: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    painScore: ''
  });

  const [painManagementForm, setPainManagementForm] = useState({
    time: '',
    medication: '',
    dose: '',
    route: '',
    response: ''
  });

  const [orderForm, setOrderForm] = useState({
    order: '',
    orderedBy: ''
  });

  const handleAdmitToRecovery = (record) => {
    const careData = {
      careId: `POSTOP${Date.now()}`,
      patientId: record.patientId,
      patientName: record.patientName,
      procedure: record.procedure,
      admissionTime: new Date().toISOString(),
      recoveryRoom: 'RR1',
      vitalSigns: [],
      painManagement: [],
      orders: [
        {
          time: new Date().toLocaleTimeString(),
          order: 'NPO for 6 hours',
          orderedBy: record.surgeon
        },
        {
          time: new Date().toLocaleTimeString(),
          order: 'IV fluids maintenance',
          orderedBy: record.anesthetist
        },
        {
          time: new Date().toLocaleTimeString(),
          order: 'Vital signs monitoring q15min',
          orderedBy: record.anesthetist
        }
      ],
      complications: [],
      dischargeCriteria: {
        stableVitals: false,
        adequatePainControl: false,
        mobilized: false,
        oralIntake: false,
        discharged: false
      },
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days later
      status: 'In Recovery'
    };

    dispatch(addPostOpCare(careData));
  };

  const handleAddVitalSigns = (careId) => {
    if (!vitalSignsForm.time || !vitalSignsForm.bloodPressure) {
      alert('Time and blood pressure are required');
      return;
    }

    dispatch(addVitalSigns({
      careId,
      vitalSigns: {
        time: vitalSignsForm.time,
        bloodPressure: vitalSignsForm.bloodPressure,
        heartRate: parseInt(vitalSignsForm.heartRate) || 0,
        temperature: parseFloat(vitalSignsForm.temperature) || 0,
        respiratoryRate: parseInt(vitalSignsForm.respiratoryRate) || 0,
        oxygenSaturation: parseInt(vitalSignsForm.oxygenSaturation) || 0,
        painScore: parseInt(vitalSignsForm.painScore) || 0
      }
    }));

    setVitalSignsForm({
      time: '',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      painScore: ''
    });
  };

  const handleAddPainManagement = (careId) => {
    if (!painManagementForm.time || !painManagementForm.medication) {
      alert('Time and medication are required');
      return;
    }

    dispatch(addPainManagement({
      careId,
      painManagement: {
        time: painManagementForm.time,
        medication: painManagementForm.medication,
        dose: painManagementForm.dose,
        route: painManagementForm.route,
        response: painManagementForm.response
      }
    }));

    setPainManagementForm({
      time: '',
      medication: '',
      dose: '',
      route: '',
      response: ''
    });
  };

  const handleAddOrder = (careId) => {
    if (!orderForm.order || !orderForm.orderedBy) {
      alert('Order details and ordering physician are required');
      return;
    }

    const newOrder = {
      time: new Date().toLocaleTimeString(),
      order: orderForm.order,
      orderedBy: orderForm.orderedBy
    };

    const care = postOpCare.find(c => c.careId === careId);
    if (care) {
      dispatch(updatePostOpCare({
        careId,
        orders: [...care.orders, newOrder]
      }));
    }

    setOrderForm({
      order: '',
      orderedBy: ''
    });
  };

  const handleDischarge = (careId) => {
    const dischargeTime = new Date().toISOString();
    dispatch(dischargePatient({ careId, dischargeTime }));
  };

  const renderActiveRecovery = () => {
    const activeCare = postOpCare.filter(care => care.status !== 'Discharged');

    return (
      <div className="space-y-6">
        {activeCare.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-gray-500 text-lg">No patients in recovery</div>
            <div className="text-gray-400 text-sm mt-2">Completed surgeries will appear here for recovery monitoring</div>
          </div>
        ) : (
          activeCare.map((care) => (
            <div key={care.careId} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {care.patientName} - Post-op {care.procedure}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    Admitted: {new Date(care.admissionTime).toLocaleString()} | Room: {care.recoveryRoom}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    care.status === 'In Recovery' ? 'bg-yellow-100 text-yellow-800' :
                    care.status === 'Stable' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {care.status}
                  </span>
                  <button
                    onClick={() => handleDischarge(care.careId)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Discharge
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vital Signs */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Vital Signs</h4>
                  <div className="space-y-2 mb-4">
                    {care.vitalSigns.slice(-3).map((vitals, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{vitals.time}</span>
                        <div className="text-sm text-gray-600">
                          BP: {vitals.bloodPressure} | HR: {vitals.heartRate} | Temp: {vitals.temperature}°C | Pain: {vitals.painScore}/10
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Vital Signs Form */}
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-800 mb-2">Add Vital Signs</h5>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Time (e.g., 14:30)"
                        value={vitalSignsForm.time}
                        onChange={(e) => setVitalSignsForm({...vitalSignsForm, time: e.target.value})}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="BP (e.g., 120/80)"
                        value={vitalSignsForm.bloodPressure}
                        onChange={(e) => setVitalSignsForm({...vitalSignsForm, bloodPressure: e.target.value})}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        placeholder="Heart Rate"
                        value={vitalSignsForm.heartRate}
                        onChange={(e) => setVitalSignsForm({...vitalSignsForm, heartRate: e.target.value})}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Temperature"
                        value={vitalSignsForm.temperature}
                        onChange={(e) => setVitalSignsForm({...vitalSignsForm, temperature: e.target.value})}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        placeholder="Pain Score (0-10)"
                        value={vitalSignsForm.painScore}
                        onChange={(e) => setVitalSignsForm({...vitalSignsForm, painScore: e.target.value})}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handleAddVitalSigns(care.careId)}
                        className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pain Management */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Pain Management</h4>
                  <div className="space-y-2 mb-4">
                    {care.painManagement.slice(-3).map((pain, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <div className="text-sm font-medium">{pain.time} - {pain.medication}</div>
                        <div className="text-sm text-gray-600">{pain.dose} {pain.route} | {pain.response}</div>
                      </div>
                    ))}
                  </div>

                  {/* Add Pain Management Form */}
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-800 mb-2">Add Pain Management</h5>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Time"
                          value={painManagementForm.time}
                          onChange={(e) => setPainManagementForm({...painManagementForm, time: e.target.value})}
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Medication"
                          value={painManagementForm.medication}
                          onChange={(e) => setPainManagementForm({...painManagementForm, medication: e.target.value})}
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Dose"
                          value={painManagementForm.dose}
                          onChange={(e) => setPainManagementForm({...painManagementForm, dose: e.target.value})}
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Route"
                          value={painManagementForm.route}
                          onChange={(e) => setPainManagementForm({...painManagementForm, route: e.target.value})}
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleAddPainManagement(care.careId)}
                          className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Add
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Response"
                        value={painManagementForm.response}
                        onChange={(e) => setPainManagementForm({...painManagementForm, response: e.target.value})}
                        className="px-2 py-1 text-sm border border-gray-300 rounded w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Orders</h4>
                <div className="space-y-2 mb-4">
                  {care.orders.map((order, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <div>
                        <span className="text-sm font-medium">{order.time}</span>
                        <span className="text-sm text-gray-700 ml-2">{order.order}</span>
                      </div>
                      <span className="text-sm text-gray-600">{order.orderedBy}</span>
                    </div>
                  ))}
                </div>

                {/* Add Order Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Order details"
                    value={orderForm.order}
                    onChange={(e) => setOrderForm({...orderForm, order: e.target.value})}
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Ordered by"
                    value={orderForm.orderedBy}
                    onChange={(e) => setOrderForm({...orderForm, orderedBy: e.target.value})}
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => handleAddOrder(care.careId)}
                    className="px-2 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                  >
                    Add Order
                  </button>
                </div>
              </div>

              {/* Discharge Criteria */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Discharge Criteria</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(care.dischargeCriteria).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          const updatedCriteria = { ...care.dischargeCriteria, [key]: e.target.checked };
                          dispatch(updatePostOpCare({ careId: care.careId, dischargeCriteria: updatedCriteria }));
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderCompletedSurgeries = () => {
    const completedRecords = intraOpRecords.filter(record => record.status === 'Completed' && !postOpCare.find(c => c.patientId === record.patientId));

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Completed Surgeries - Ready for Recovery</h3>

        {completedRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No completed surgeries pending recovery admission
          </div>
        ) : (
          <div className="space-y-4">
            {completedRecords.map((record) => (
              <div key={record.recordId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {record.patientName} - {record.procedure}
                    </h4>
                    <div className="text-sm text-gray-600 mt-1">
                      Completed: {new Date(record.endTime).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Duration: {Math.floor((new Date(record.endTime) - new Date(record.startTime)) / (1000 * 60))} minutes
                    </div>
                  </div>
                  <button
                    onClick={() => handleAdmitToRecovery(record)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Admit to Recovery
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderDischargedPatients = () => {
    const dischargedCare = postOpCare.filter(care => care.status === 'Discharged');
    const displayedItems = dischargedCare.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Discharged Patients</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discharge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Follow-up</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((care) => (
                <tr key={care.careId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{care.patientName}</div>
                    <div className="text-sm text-gray-500">ID: {care.patientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {care.procedure}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(care.admissionTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {care.dischargeTime ? new Date(care.dischargeTime).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {care.followUpDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">
                      View Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dischargedCare.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(dischargedCare.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    );
  };

  return (
    <div className="post-operative-care p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Post-Operative Care</h2>
        <p className="text-gray-600">Recovery monitoring, pain management, and discharge planning</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'active', label: 'Active Recovery', count: postOpCare.filter(c => c.status !== 'Discharged').length },
              { id: 'completed', label: 'Completed Surgeries', count: intraOpRecords.filter(r => r.status === 'Completed' && !postOpCare.find(c => c.patientId === r.patientId)).length },
              { id: 'discharged', label: 'Discharged Patients', count: postOpCare.filter(c => c.status === 'Discharged').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'active' && renderActiveRecovery()}
        {activeTab === 'completed' && renderCompletedSurgeries()}
        {activeTab === 'discharged' && renderDischargedPatients()}
      </div>
    </div>
  );
};

export default PostOperativeCare;