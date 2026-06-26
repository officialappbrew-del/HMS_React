import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  TrendingDown,
  Barcode,
  Box
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { apiRequest } from '../utils/api';
import { fetchDrugs } from '../features/pharmacySlice';

const Inventory = () => {
  const dispatch = useDispatch();
  const { drugs, loading } = useSelector(state => state.pharmacy || { drugs: [], loading: false });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    title: '',
    message: '',
    onConfirm: null,
  });

  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    quantity: '',
    reorderLevel: '',
    unit: 'tablets',
    supplier: '',
    expiryDate: '',
    unitCost: ''
  });

  useEffect(() => {
    dispatch(fetchDrugs());
  }, [dispatch]);

  const getStatus = (drug) => {
    const qty = parseInt(drug.stock_quantity) || 0;
    const reorder = parseInt(drug.reorder_level) || 0;
    if (qty === 0) return 'out-of-stock';
    if (qty <= reorder) return 'low-stock';
    return 'in-stock';
  };

  const filteredInventory = drugs.map(drug => ({
    id: drug.id,
    name: drug.name,
    batchNumber: drug.batch_number || '-',
    quantity: drug.stock_quantity,
    reorderLevel: drug.reorder_level,
    unit: drug.unit_of_measure || drug.form || 'tablets',
    supplier: drug.supplier || '-',
    expiryDate: drug.expiry_date || '',
    unitCost: drug.unit_price,
    status: getStatus(drug),
  })).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddInventory = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.reorderLevel) return;

    try {
      const tenantPublicId = localStorage.getItem('tenantId');
      const status = parseInt(formData.quantity) === 0 ? 'out-of-stock' :
                     parseInt(formData.quantity) <= parseInt(formData.reorderLevel) ? 'low-stock' : 'in-stock';

      const payload = {
        name: formData.name.trim(),
        drug_code: `INV-${Date.now()}`,
        category: 'other',
        form: formData.unit,
        stock_quantity: parseInt(formData.quantity),
        reorder_level: parseInt(formData.reorderLevel),
        unit_price: parseFloat(formData.unitCost) || 0,
        selling_price: parseFloat(formData.unitCost) || 0,
        batch_number: formData.batchNumber.trim(),
        expiry_date: formData.expiryDate || null,
        supplier: formData.supplier.trim(),
        unit_of_measure: formData.unit,
        tenant: tenantPublicId,
      };

      if (editingId) {
        await apiRequest(`/api/v1/pharmacy/drugs/${editingId}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/api/v1/pharmacy/drugs/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      dispatch(fetchDrugs());
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        batchNumber: '',
        quantity: '',
        reorderLevel: '',
        unit: 'tablets',
        supplier: '',
        expiryDate: '',
        unitCost: ''
      });
    } catch (err) {
      setModalConfig({
        isOpen: true,
        type: 'default',
        title: 'Error',
        message: err.message || 'Failed to save inventory item',
      });
    }
  };

  const handleDeleteClick = (item) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      title: 'Delete Inventory Item',
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await apiRequest(`/api/v1/pharmacy/drugs/${item.id}/`, { method: 'DELETE' });
          dispatch(fetchDrugs());
        } catch (err) {
          setModalConfig({
            isOpen: true,
            type: 'default',
            title: 'Error',
            message: err.message || 'Failed to delete item',
          });
          return;
        }
        setModalConfig({ ...modalConfig, isOpen: false });
      },
    });
  };

  const handleEditInventory = (item) => {
    setFormData({
      name: item.name,
      batchNumber: item.batchNumber === '-' ? '' : item.batchNumber,
      quantity: String(item.quantity),
      reorderLevel: String(item.reorderLevel),
      unit: item.unit,
      supplier: item.supplier === '-' ? '' : item.supplier,
      expiryDate: item.expiryDate || '',
      unitCost: String(item.unitCost || 0)
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleModalConfirm = () => {
    if (modalConfig.onConfirm) modalConfig.onConfirm();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in-stock':
        return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span>;
      case 'low-stock':
        return <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 flex items-center gap-1">Low Stock</span>;
      case 'out-of-stock':
        return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">Out of Stock</span>;
      default:
        return status;
    }
  };

  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.quantity * (parseFloat(item.unitCost) || 0)), 0);
  const lowStockCount = filteredInventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <p className="text-gray-600 mt-2">Manage pharmaceutical stock and inventory</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Items</p>
              <p className="text-3xl font-bold mt-2">{drugs.length}</p>
            </div>
            <Box className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">In Stock</p>
              <p className="text-3xl font-bold mt-2">{filteredInventory.filter(i => i.status === 'in-stock').length}</p>
            </div>
            <Package className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Low Stock</p>
              <p className="text-3xl font-bold mt-2">{lowStockCount}</p>
            </div>
            <TrendingDown className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold mt-2">₦{totalValue.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (editingId) setEditingId(null);
              setFormData({
                name: '',
                batchNumber: '',
                quantity: '',
                reorderLevel: '',
                unit: 'tablets',
                supplier: '',
                expiryDate: '',
                unitCost: ''
              });
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h3>
          <form onSubmit={handleAddInventory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Drug Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Paracetamol"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="BTH-2025-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                placeholder="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tablets">Tablets</option>
                <option value="capsules">Capsules</option>
                <option value="bottles">Bottles</option>
                <option value="boxes">Boxes</option>
                <option value="vials">Vials</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Cost (₦)</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Supplier name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                {editingId ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    batchNumber: '',
                    quantity: '',
                    reorderLevel: '',
                    unit: 'tablets',
                    supplier: '',
                    expiryDate: '',
                    unitCost: ''
                  });
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading inventory...</div>
        ) : filteredInventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Drug Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Batch</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Qty</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reorder</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Supplier</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Expiry</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Barcode className="w-4 h-4 text-gray-400" />
                        {item.batchNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.quantity} {item.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.reorderLevel}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.supplier}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-NG') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEditInventory(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No inventory items found</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.type === 'delete' ? 'Delete' : 'OK'}
      />
    </div>
  );
};

export default Inventory;
