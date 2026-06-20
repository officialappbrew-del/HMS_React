import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClinicalNote } from '../../features/emrSlice';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import LabOrderForm from './LabOrderForm';
import MedicationOrderForm from './MedicationOrderForm';

const OrderEntrySystem = ({ patientId }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('lab');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const tabs = [
    { id: 'lab', label: 'Laboratory Orders', icon: FileText },
    { id: 'medication', label: 'Medication Orders', icon: Plus },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'lab':
        return <LabOrderForm patientId={patientId} />;
      case 'medication':
        return <MedicationOrderForm patientId={patientId} />;
      default:
        return <LabOrderForm patientId={patientId} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="w-8 h-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Order Entry System</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="tab-content">
        {renderActiveTab()}
      </div>

      {/* Order History Summary */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent orders found</p>
            <p className="text-sm">Orders will appear here once created</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEntrySystem;