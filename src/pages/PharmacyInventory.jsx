import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  addDrug,
  updateDrug,
  addPurchaseOrder,
  acknowledgeLowStockAlert,
  fetchDrugs,
  fetchSuppliers,
} from '../features/pharmacySlice';
import { pharmacyApi, parseListResponse } from '../utils/api';
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const PharmacyInventory = () => {
  const dispatch = useDispatch();
  const { drugs, lowStockAlerts, purchaseOrders, suppliers, loading, error } = useSelector(state => state.pharmacy || {});

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('drug');
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('inventory');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dosageForms = [
    { value: 'tablet', label: 'Tablets' },
    { value: 'capsule', label: 'Capsules' },
    { value: 'syrup', label: 'Syrup' },
    { value: 'injection', label: 'Injection' },
    { value: 'ointment', label: 'Ointment' },
    { value: 'cream', label: 'Cream' },
    { value: 'drops', label: 'Drops' },
    { value: 'inhaler', label: 'Inhaler' },
    { value: 'suppository', label: 'Suppository' },
  ];
  const categories = ['antibiotic', 'analgesic', 'antihypertensive', 'antidiabetic', 'antimalarial', 'vaccine', 'supplement', 'other'];

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

  useEffect(() => {
    dispatch(fetchDrugs());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formType === 'drug') {
      if (!formData.name) {
        setErrorMessage('Drug name is required.');
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          name: formData.name.trim(),
          generic_name: formData.genericName || '',
          brand_name: formData.brandName || '',
          drug_code: `DRUG-${Date.now()}`,
          category: formData.category || 'other',
          form: formData.dosageForm || 'tablet',
          strength: formData.strength || '',
          stock_quantity: parseInt(formData.quantityInStock) || 0,
          reorder_level: parseInt(formData.reorderLevel) || 0,
          unit_price: parseFloat(formData.unitCost) || 0,
          selling_price: parseFloat(formData.sellingPrice) || 0,
          unit_of_measure: 'piece',
          batch_number: formData.batchNumber || '',
          expiry_date: formData.expiryDate || null,
          supplier: formData.supplier || '',
          manufacturer: formData.manufacturer || '',
          storage_conditions: 'Room temperature',
        };

        const created = await pharmacyApi.createDrug(payload);
        const normalizedDrug = {
          ...created,
          quantityInStock: created.stock_quantity,
          reorderLevel: created.reorder_level,
          unitPrice: created.unit_price,
          sellingPrice: created.selling_price,
          expiryDate: created.expiry_date,
          batchNumber: created.batch_number,
          genericName: created.generic_name,
          brandName: created.brand_name,
          drugCode: created.drug_code,
          dosageForm: created.form,
        };
        dispatch(addDrug(normalizedDrug));
        setSuccessMessage('Drug added successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
        resetForm();
        setShowForm(false);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to add drug.');
      } finally {
        setIsSubmitting(false);
      }
    }

    if (formType === 'transaction') {
      if (!formData.drugId || !formData.quantity || formData.quantity <= 0) {
        setErrorMessage('Please select a drug and enter a valid quantity.');
        return;
      }

      setIsSubmitting(true);
      try {
        if (formData.type === 'Stock In') {
          await pharmacyApi.restockDrug(formData.drugId, {
            quantity: parseInt(formData.quantity),
            batch_number: formData.batchNumberTrans || '',
            expiry_date: formData.expiryDateTrans || null,
          });
          dispatch(updateDrug({
            id: formData.drugId,
            quantityInStock: (drugs.find(d => d.id === formData.drugId)?.quantityInStock || 0) + parseInt(formData.quantity),
            lastRestocked: new Date().toISOString().split('T')[0],
          }));
          dispatch(fetchDrugs());
        } else if (formData.type === 'Stock Out') {
          const drug = drugs.find(d => d.id === formData.drugId);
          const currentStock = drug?.quantityInStock || 0;
          const newStock = Math.max(0, currentStock - parseInt(formData.quantity));
          await pharmacyApi.updateDrug(formData.drugId, {
            stock_quantity: newStock,
          });
          dispatch(updateDrug({
            id: formData.drugId,
            quantityInStock: newStock,
          }));
          dispatch(fetchDrugs());
        }
        setSuccessMessage(`Stock ${formData.type === 'Stock In' ? 'in' : 'out'} recorded successfully.`);
        setTimeout(() => setSuccessMessage(''), 3000);
        resetForm();
        setShowForm(false);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to record stock transaction.');
      } finally {
        setIsSubmitting(false);
      }
    }

    if (formType === 'order') {
      if (!formData.supplierId || formData.items.length === 0) {
        setErrorMessage('Please select a supplier and add at least one item.');
        return;
      }

      setIsSubmitting(true);
      try {
        const po = {
          poId: `PO-${Date.now()}`,
          supplier: suppliers.find(s => s.id === formData.supplierId)?.name || formData.supplierId,
          supplierId: formData.supplierId,
          orderDate: new Date().toISOString().split('T')[0],
          expectedDelivery: formData.expectedDelivery,
          status: 'Pending',
          items: formData.items,
          totalAmount: formData.items.reduce((sum, item) => sum + (item.totalCost || 0), 0),
          notes: formData.notes,
        };
        dispatch(addPurchaseOrder(po));
        setSuccessMessage('Purchase order created successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
        resetForm();
        setShowForm(false);
      } catch (err) {
        setErrorMessage('Failed to create purchase order.');
      } finally {
        setIsSubmitting(false);
      }
    }
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
        unitCost: drug.unitPrice || 0,
        totalCost: parseInt(formData.itemQuantity) * (drug.unitPrice || 0)
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
                      ₦{drug.unitPrice?.toLocaleString()}
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
            <div key={alert.alertId || alert.drugId} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-orange-900">{alert.drugName || alert.name}</h4>
                  <p className="text-orange-800 mt-1">
                    Current Stock: {alert.currentStock || alert.quantityInStock} | Reorder Point: {alert.reorderPoint || alert.reorderLevel}
                  </p>
                  <div className="text-sm text-orange-600 mt-2">
                    Created: {alert.createdDate}
                    {alert.acknowledgedBy && ` | Acknowledged by: ${alert.acknowledgedBy}`}
                  </div>
                </div>
                {!alert.acknowledgedBy && (
                  <button
                    onClick={() => acknowledgeAlert(alert.alertId || alert.drugId)}
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
          {purchaseOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No purchase orders found
            </div>
          ) : (
            purchaseOrders.map((order) => (
              <div key={order.poId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{order.poId}</h4>
                    <p className="text-sm text-gray-600">Supplier: {order.supplier}</p>
                    <p className="text-sm text-gray-600">Order Date: {order.orderDate}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'Approved' || order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
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
            ))
          )}
        </div>
      </div>
    );
  };

  const itemsPerPage = 10;

  return (
    <div className="pharmacy-inventory p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Pharmacy Inventory Management</h2>
        <p className="text-gray-600">Drug stock tracking, batch management, and expiry monitoring</p>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-sm text-red-800 flex items-center justify-between rounded">
          <span className="flex items-center gap-2">
            <span>&#9888;</span>
            {errorMessage}
          </span>
          <button onClick={() => setErrorMessage('')} className="text-red-600 hover:text-red-800">×</button>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-sm text-green-800 flex items-center justify-between rounded">
          <span className="flex items-center gap-2">
            <span>&#10003;</span>
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-800">×</button>
        </div>
      )}

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
          <div className="bg-white border border-[#E8E3DC] p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">
                {formType === 'drug' && (editingId ? 'Edit Drug' : 'Add New Drug')}
                {formType === 'transaction' && 'Stock Transaction'}
                {formType === 'order' && 'Create Purchase Order'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                type="button"
                className="px-2 py-1 text-sm text-[#5A5A5A] border border-[#D8D4CD] hover:bg-[#F7F5F2] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formType === 'drug' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Drug Name <span className="text-[#C8553D]">*</span>
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Paracetamol" required className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Generic Name</label>
                    <input type="text" name="genericName" value={formData.genericName} onChange={handleChange} placeholder="e.g., Acetaminophen" className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Batch Number</label>
                    <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleChange} placeholder="BTH-2025-001" className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Current Quantity <span className="text-[#C8553D]">*</span></label>
                    <input type="number" name="quantityInStock" min="0" value={formData.quantityInStock} onChange={handleChange} required className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Reorder Level <span className="text-[#C8553D]">*</span></label>
                    <input type="number" name="reorderLevel" min="0" value={formData.reorderLevel} onChange={handleChange} required className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Dosage Form</label>
                    <select name="dosageForm" value={formData.dosageForm} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors">
                      <option value="">Select form</option>
                      {dosageForms.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Unit Cost (NGN)</label>
                    <input type="number" name="unitCost" min="0" step="0.01" value={formData.unitCost} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Selling Price (NGN)</label>
                    <input type="number" name="sellingPrice" min="0" step="0.01" value={formData.sellingPrice} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Supplier</label>
                    <select name="supplier" value={formData.supplier} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors">
                      <option value="">Select supplier</option>
                      {suppliers.map(supplier => <option key={supplier.id} value={supplier.name}>{supplier.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Expiry Date</label>
                    <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Manufacturer</label>
                    <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} placeholder="Manufacturer name" className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" />
                  </div>
                </div>
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
                            <option key={sup.id} value={sup.name}>{sup.name}</option>
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
                        <option key={sup.id} value={sup.id}>{sup.name}</option>
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

              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#008751] hover:bg-[#006B40] text-white px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {isSubmitting ? 'Saving...' :
                    (formType === 'drug' && (editingId ? 'Update Drug' : 'Add Drug')) ||
                    (formType === 'transaction' && 'Record Transaction') ||
                    (formType === 'order' && 'Create Purchase Order')
                  }
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A] px-3.5 py-2 text-sm font-medium transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
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
