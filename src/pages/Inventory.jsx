import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  TrendingDown,
  Barcode,
  Box
} from 'lucide-react';

const Inventory = () => {
  const dispatch = useDispatch();
  const { drugs } = useSelector(state => state.pharmacy || { drugs: [] });

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Paracetamol',
      batchNumber: 'BTH-2025-001',
      quantity: 500,
      reorderLevel: 100,
      unit: 'tablets',
      supplier: 'Pharma Plus',
      expiryDate: '2027-12-31',
      unitCost: 50,
      status: 'in-stock'
    },
    {
      id: 2,
      name: 'Amoxicillin',
      batchNumber: 'BTH-2025-002',
      quantity: 45,
      reorderLevel: 100,
      unit: 'capsules',
      supplier: 'MediCare Ltd',
      expiryDate: '2027-08-15',
      unitCost: 500,
      status: 'low-stock'
    },
    {
      id: 3,
      name: 'Lisinopril',
      batchNumber: 'BTH-2025-003',
      quantity: 0,
      reorderLevel: 50,
      unit: 'tablets',
      supplier: 'Health Plus',
      expiryDate: '2027-06-30',
      unitCost: 1200,
      status: 'out-of-stock'
    },
    {
      id: 4,
      name: 'Ibuprofen',
      batchNumber: 'BTH-2025-004',
      quantity: 200,
      reorderLevel: 100,
      unit: 'tablets',
      supplier: 'Pharma Plus',
      expiryDate: '2027-11-20',
      unitCost: 75,
      status: 'in-stock'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddInventory = (e) => {
    e.preventDefault();
    if (formData.name && formData.quantity && formData.reorderLevel) {
      const status = formData.quantity === 0 ? 'out-of-stock' : 
                    formData.quantity <= formData.reorderLevel ? 'low-stock' : 'in-stock';
      
      if (editingId) {
        setInventory(inventory.map(item =>
          item.id === editingId
            ? { ...item, ...formData, quantity: parseInt(formData.quantity), reorderLevel: parseInt(formData.reorderLevel), unitCost: parseFloat(formData.unitCost), status }
            : item
        ));
        setEditingId(null);
      } else {
        const newItem = {
          id: Math.max(...inventory.map(i => i.id), 0) + 1,
          ...formData,
          quantity: parseInt(formData.quantity),
          reorderLevel: parseInt(formData.reorderLevel),
          unitCost: parseFloat(formData.unitCost),
          status
        };
        setInventory([...inventory, newItem]);
      }
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
      setShowForm(false);
    }
  };

  const handleDeleteInventory = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleEditInventory = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in-stock':
        return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span>;
      case 'low-stock':
        return <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Low Stock</span>;
      case 'out-of-stock':
        return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">Out of Stock</span>;
      default:
        return status;
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  const lowStockCount = inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;

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
              <p className="text-3xl font-bold mt-2">{inventory.length}</p>
            </div>
            <Box className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">In Stock</p>
              <p className="text-3xl font-bold mt-2">{inventory.filter(i => i.status === 'in-stock').length}</p>
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
            <AlertCircle className="w-12 h-12 text-yellow-500 opacity-70" />
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
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
            className="flex items-center gap-2 bg-nigerian-green text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all font-medium"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Supplier name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-nigerian-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-all font-medium"
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
        {filteredInventory.length > 0 ? (
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
                      {new Date(item.expiryDate).toLocaleDateString('en-NG')}
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
                        onClick={() => handleDeleteInventory(item.id)}
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
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No inventory items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
