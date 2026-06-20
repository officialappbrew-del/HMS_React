import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  addDrug,
  updateDrug,
  acknowledgeLowStockAlert
} from '../features/pharmacySlice';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const PharmacyInventory = () => {
  const dispatch = useDispatch();
  const { drugs, lowStockAlerts, purchaseOrders } = useSelector(state => state.pharmacy);

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('drug'); // Added missing state
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('inventory'); // Added missing state
  const itemsPerPage = 10;

  // Added missing constants
  const dosageForms = ['Tablet', 'Capsule', 'Injection', 'Syrup', 'Suspension', 'Cream', 'Ointment', 'Drops'];
  const categories = ['Antimalarial', 'Antibiotic', 'Analgesic', 'Antihypertensive', 'Antidiabetic', 'Antiviral'];
  const suppliers = [
    { supplierId: 1, name: 'MediPharm Ltd' },
    { supplierId: 2, name: 'HealthCorp Nigeria' },
    { supplierId: 3, name: 'PharmaPlus' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brandName: '',
    strength: '',
    dosageForm: '',
    batchNumber: '',
    expiryDate: '',
    manufacturer: '',
    supplier: '',
    quantityInStock: 0,
    reorderLevel: 0,
    unitCost: 0,
    sellingPrice: 0,
    category: '',
    packSize: '', // Added missing field
    currentStock: 0, // Added missing field
    reorderPoint: 0, // Added missing field
    drugId: '', // Added for transaction form
    type: 'Stock In', // Added for transaction form
    quantity: 0, // Added for transaction form
    batchNumberTrans: '', // Added for transaction form
    expiryDateTrans: '', // Added for transaction form
    supplierTrans: '', // Added for transaction form
    supplierId: '', // Added for order form
    expectedDelivery: '', // Added for order form
    items: [], // Added for order form
    selectedDrugId: '', // Added for order form
    itemQuantity: 0, // Added for order form
    notes: '' // Added missing field
  });

  // Initialize with sample data if empty
  useEffect(() => {
    if (drugs.length === 0 && !localStorage.getItem('pharmacyInitialized')) {
      localStorage.setItem('pharmacyInitialized', 'true');
      const sampleDrugs = [
        {
          id: 1,
          name: 'Artemether/Lumefantrine',
          genericName: 'Artemether + Lumefantrine',
          brandName: 'Coartem',
          strength: '20/120mg',
          dosageForm: 'Tablet',
          batchNumber: 'BATCH-AL-2024-001',
          expiryDate: '2025-12-31',
          manufacturer: 'Novartis',
          supplier: 'MediPharm Ltd',
          quantityInStock: 500,
          reorderLevel: 100,
          unitCost: 150,
          sellingPrice: 200,
          category: 'Antimalarial',
          lastRestocked: '2024-01-15'
        },
        {
          id: 2,
          name: 'Amoxicillin Capsules',
          genericName: 'Amoxicillin',
          brandName: 'Amoxil',
          strength: '500mg',
          dosageForm: 'Capsule',
          batchNumber: 'BATCH-AMX-2023-002',
          expiryDate: '2024-06-30',
          manufacturer: 'GSK',
          supplier: 'HealthCorp Nigeria',
          quantityInStock: 200,
          reorderLevel: 50,
          unitCost: 50,
          sellingPrice: 80,
          category: 'Antibiotic',
          lastRestocked: '2024-01-10'
        },
        {
          id: 3,
          name: 'Morphine Injection',
          genericName: 'Morphine Sulfate',
          brandName: 'Morphine',
          strength: '10mg/ml',
          dosageForm: 'Injection',
          batchNumber: 'BATCH-MOR-2024-001',
          expiryDate: '2025-03-31',
          manufacturer: 'Emzor',
          supplier: 'PharmaPlus',
          quantityInStock: 20,
          reorderLevel: 10,
          unitCost: 800,
          sellingPrice: 1200,
          category: 'Analgesic',
          lastRestocked: '2024-01-05'
        }
      ];
      sampleDrugs.forEach(drug => dispatch(addDrug(drug)));
    }
  }, [dispatch, drugs.length]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formType === 'drug') {
      if (!formData.name || !formData.genericName) {
        alert('Drug name and generic name are required');
        return;
      }

      const newDrug = {
        id: Date.now(),
        name: formData.name,
        genericName: formData.genericName,
        brandName: formData.brandName,
        strength: formData.strength,
        dosageForm: formData.dosageForm,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        manufacturer: formData.manufacturer,
        supplier: formData.supplier,
        quantityInStock: parseInt(formData.quantityInStock),
        reorderLevel: parseInt(formData.reorderLevel),
        unitCost: parseFloat(formData.unitCost),
        sellingPrice: parseFloat(formData.sellingPrice),
        category: formData.category,
        lastRestocked: new Date().toISOString().split('T')[0],
      };

      dispatch(addDrug(newDrug));
      resetForm();
      setShowForm(false);
    }
    // Add other form type submissions here
  };

  const resetForm = () => {
    setFormData({
      name: '',
      genericName: '',
      brandName: '',
      strength: '',
      dosageForm: '',
      batchNumber: '',
      expiryDate: '',
      manufacturer: '',
      supplier: '',
      quantityInStock: 0,
      reorderLevel: 0,
      unitCost: 0,
      sellingPrice: 0,
      category: '',
      packSize: '',
      currentStock: 0,
      reorderPoint: 0,
      drugId: '',
      type: 'Stock In',
      quantity: 0,
      batchNumberTrans: '',
      expiryDateTrans: '',
      supplierTrans: '',
      supplierId: '',
      expectedDelivery: '',
      items: [],
      selectedDrugId: '',
      itemQuantity: 0,
      notes: ''
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addOrderItem = () => {
    const drug = drugs.find(d => d.id === formData.selectedDrugId);
    if (drug && formData.itemQuantity > 0) {
      const item = {
        drugId: drug.id,
        name: drug.name,
        quantity: parseInt(formData.itemQuantity),
        unitCost: drug.unitCost,
        totalCost: parseInt(formData.itemQuantity) * drug.unitCost
      };
      setFormData({
        ...formData,
        items: [...formData.items, item],
        selectedDrugId: '',
        itemQuantity: 0
      });
    }
  };

  const acknowledgeAlert = (alertId) => {
    dispatch(acknowledgeLowStockAlert({ alertId, acknowledgedBy: 'Current User' }));
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'Unknown', color: 'bg-gray-100 text-gray-800' };

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpiry <= 30) return { status: 'Expiring Soon', color: 'bg-orange-100 text-orange-800' };
    if (daysUntilExpiry <= 90) return { status: 'Watch', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Good', color: 'bg-green-100 text-green-800' };
  };

  const renderInventoryTable = () => {
    const displayedItems = drugs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Drug Inventory</h3>
          <button
            onClick={() => {
              setFormType('drug');
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add Drug
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((drug) => {
                const expiryStatus = getExpiryStatus(drug.expiryDate);
                return (
                  <tr key={drug.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{drug.name}</div>
                      <div className="text-sm text-gray-500">{drug.strength} {drug.dosageForm}</div>
                      <div className="text-xs text-gray-400">Batch: {drug.batchNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{drug.quantityInStock} / {drug.reorderLevel}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        drug.quantityInStock <= drug.reorderLevel ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {drug.quantityInStock <= drug.reorderLevel ? 'Low Stock' : 'In Stock'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{drug.expiryDate}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${expiryStatus.color}`}>
                        {expiryStatus.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {drug.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{drug.unitCost?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setFormType('transaction');
                          setFormData({...formData, drugId: drug.id});
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Stock In/Out
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {drugs.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(drugs.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    );
  };

  const renderLowStockAlerts = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Low Stock Alerts</h3>

      {lowStockAlerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No low stock alerts
        </div>
      ) : (
        <div className="space-y-4">
          {lowStockAlerts.map((alert) => (
            <div key={alert.alertId} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-orange-900">{alert.drugName}</h4>
                  <p className="text-orange-800 mt-1">
                    Current Stock: {alert.currentStock} | Reorder Point: {alert.reorderPoint}
                  </p>
                  <div className="text-sm text-orange-600 mt-2">
                    Created: {alert.createdDate}
                    {alert.acknowledgedBy && ` | Acknowledged by: ${alert.acknowledgedBy}`}
                  </div>
                </div>
                {!alert.acknowledgedBy && (
                  <button
                    onClick={() => acknowledgeAlert(alert.alertId)}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPurchaseOrders = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Purchase Orders</h3>
          <button
            onClick={() => {
              setFormType('order');
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Create PO
          </button>
        </div>

        <div className="space-y-4">
          {purchaseOrders.map((order) => (
            <div key={order.poId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{order.poId}</h4>
                  <p className="text-sm text-gray-600">Supplier: {order.supplier}</p>
                  <p className="text-sm text-gray-600">Order Date: {order.orderDate}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    ₦{order.totalAmount?.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Items: {order.items?.length || 0} | Expected: {order.expectedDelivery}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pharmacy-inventory p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Pharmacy Inventory Management</h2>
        <p className="text-gray-600">Drug stock tracking, batch management, and expiry monitoring</p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            className={`pb-2 px-4 ${activeTab === 'inventory' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button
            className={`pb-2 px-4 ${activeTab === 'alerts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('alerts')}
          >
            Alerts
          </button>
          <button
            className={`pb-2 px-4 ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {formType === 'drug' && 'Add New Drug'}
                {formType === 'transaction' && 'Stock Transaction'}
                {formType === 'order' && 'Create Purchase Order'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formType === 'drug' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Drug Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Generic Name *</label>
                      <input
                        type="text"
                        name="genericName"
                        value={formData.genericName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                      <input
                        type="text"
                        name="brandName"
                        value={formData.brandName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Strength</label>
                      <input
                        type="text"
                        name="strength"
                        value={formData.strength}
                        onChange={handleChange}
                        placeholder="e.g., 500mg"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dosage Form</label>
                      <select
                        name="dosageForm"
                        value={formData.dosageForm}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Form</option>
                        {dosageForms.map(form => (
                          <option key={form} value={form}>{form}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pack Size</label>
                      <input
                        type="number"
                        name="packSize"
                        value={formData.packSize}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Unit Cost (₦)</label>
                      <input
                        type="number"
                        name="unitCost"
                        value={formData.unitCost}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Selling Price (₦)</label>
                      <input
                        type="number"
                        name="sellingPrice"
                        value={formData.sellingPrice}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Stock</label>
                      <input
                        type="number"
                        name="currentStock"
                        value={formData.currentStock}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reorder Point</label>
                      <input
                        type="number"
                        name="reorderPoint"
                        value={formData.reorderPoint}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Supplier</label>
                      <select
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map(sup => (
                          <option key={sup.supplierId} value={sup.name}>{sup.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                      <input
                        type="text"
                        name="batchNumber"
                        value={formData.batchNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {formType === 'transaction' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Drug *</label>
                    <select
                      name="drugId"
                      value={formData.drugId}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Drug</option>
                      {drugs.map(drug => (
                        <option key={drug.id} value={drug.id}>
                          {drug.name} ({drug.quantityInStock} in stock)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Stock In">Stock In</option>
                        <option value="Stock Out">Stock Out</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {formData.type === 'Stock In' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                        <input
                          type="text"
                          name="batchNumberTrans"
                          value={formData.batchNumberTrans}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                          type="date"
                          name="expiryDateTrans"
                          value={formData.expiryDateTrans}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Supplier</label>
                        <select
                          name="supplierTrans"
                          value={formData.supplierTrans}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Supplier</option>
                          {suppliers.map(sup => (
                            <option key={sup.supplierId} value={sup.name}>{sup.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}

              {formType === 'order' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Supplier *</label>
                    <select
                      name="supplierId"
                      value={formData.supplierId}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(sup => (
                        <option key={sup.supplierId} value={sup.supplierId}>{sup.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Delivery</label>
                    <input
                      type="date"
                      name="expectedDelivery"
                      value={formData.expectedDelivery}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Order Items</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                      <select
                        value={formData.selectedDrugId || ''}
                        onChange={(e) => setFormData({...formData, selectedDrugId: e.target.value})}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="">Select Drug</option>
                        {drugs.map(drug => (
                          <option key={drug.id} value={drug.id}>{drug.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={formData.itemQuantity || ''}
                        onChange={(e) => setFormData({...formData, itemQuantity: e.target.value})}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={addOrderItem}
                        className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Add Item
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{item.name} - {item.quantity} units</span>
                          <span className="text-sm font-medium">₦{item.totalCost?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
              >
                {formType === 'drug' && 'Add Drug'}
                {formType === 'transaction' && 'Record Transaction'}
                {formType === 'order' && 'Create Purchase Order'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'inventory' && renderInventoryTable()}
        {activeTab === 'alerts' && renderLowStockAlerts()}
        {activeTab === 'orders' && renderPurchaseOrders()}
      </div>
    </div>
  );
};

export default PharmacyInventory;