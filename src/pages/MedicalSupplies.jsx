import { useEffect, useState } from 'react';
import { Package, Plus, AlertCircle, Droplet, Wrench, Menu, X, Search, Filter } from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { apiRequest, parseListResponse } from '../utils/api';

const MedicalSupplies = () => {
  const getArray = (value) => Array.isArray(value) ? value : [];

  const [inventoryItems, setInventoryItems] = useState([]);
  const [activeTab, setActiveTab] = useState('consumables');
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    quantity: '',
    expiryDate: '',
    supplier: '',
    unitCost: '',
    batchNumber: ''
  });

  const sectionFromItem = (item = {}) => {
    const haystack = `${item.name || ''} ${item.category || ''} ${item.generic_name || ''} ${item.form || ''}`.toLowerCase();

    if (/reagent|lab|test|diagnostic|culture|kit/.test(haystack)) return 'reagents';
    if (/radiology|x-ray|imaging|scan|film|contrast/.test(haystack)) return 'radiology';
    if (/surgical|instrument|scalpel|forceps|needle|drill/.test(haystack)) return 'surgical';
    if (/linen|laundry|sheet|drape|gown/.test(haystack)) return 'linen';
    return 'consumables';
  };

  const normalizeInventoryItem = (item = {}) => {
    const currentStock = Number(item.stock_quantity ?? item.currentStock ?? item.quantityInStock ?? 0);
    const reorderPoint = Number(item.reorder_level ?? item.reorderPoint ?? 0);
    const unitCost = Number(item.unit_price ?? item.unitCost ?? 0);
    const section = item.section || sectionFromItem(item);

    return {
      id: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      consumableId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      reagentId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      radiologyId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      instrumentId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      linenId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      name: item.name || item.drug_name || 'Unnamed Item',
      category: item.category || item.form || 'General',
      type: item.type || item.form || 'General',
      quantityInStock: currentStock,
      quantity: currentStock,
      currentStock,
      reorderPoint,
      unitCost,
      expiryDate: item.expiry_date || item.expiryDate || null,
      status: currentStock <= reorderPoint ? 'Low Stock' : 'Available',
      testType: item.testType || item.category || 'General',
      storageTemp: item.storage_conditions || item.storageTemp || 'Room Temp',
      sterilizationStatus: item.sterilizationStatus || 'Pending',
      condition: item.condition || 'Good',
      section,
      source: 'api'
    };
  };

  const loadSupplies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiRequest('/api/v1/pharmacy/drugs/?page_size=100');
      const list = parseListResponse(response);
      const normalized = getArray(list).map(normalizeInventoryItem);
      setInventoryItems(normalized);
    } catch (error) {
      setInventoryItems([]);
      setErrorMessage(error.message || 'Unable to load medical supplies from the API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSupplies();
  }, []);

  const consumables = getArray(inventoryItems.filter(item => item.section === 'consumables'));
  const laboratoryReagents = getArray(inventoryItems.filter(item => item.section === 'reagents'));
  const radiologySupplies = getArray(inventoryItems.filter(item => item.section === 'radiology'));
  const surgicalInstruments = getArray(inventoryItems.filter(item => item.section === 'surgical'));
  const linenAndLaundry = getArray(inventoryItems.filter(item => item.section === 'linen'));
  const wasteManagement = getArray([]);
  const donations = getArray([]);

  // Safe filter with null checks
  const lowStockConsumables = consumables.filter(c => {
    if (!c || !c.currentStock || !c.reorderPoint) return false;
    return c.currentStock <= c.reorderPoint;
  });
  
  const pendingWaste = wasteManagement.filter(w => {
    if (!w || !w.status) return false;
    return w.status === 'Pending';
  });

  // Filter items based on search query for active tab
  const getFilteredItems = () => {
    if (!searchQuery) {
      switch(activeTab) {
        case 'consumables': return consumables;
        case 'reagents': return laboratoryReagents;
        case 'radiology': return radiologySupplies;
        case 'surgical': return surgicalInstruments;
        case 'linen': return linenAndLaundry;
        case 'waste': return wasteManagement;
        default: return [];
      }
    }

    const query = searchQuery.toLowerCase();
    switch(activeTab) {
      case 'consumables':
        return consumables.filter(item => 
          item.name?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.status?.toLowerCase().includes(query)
        );
      case 'reagents':
        return laboratoryReagents.filter(item =>
          item.name?.toLowerCase().includes(query) ||
          item.testType?.toLowerCase().includes(query)
        );
      case 'radiology':
        return radiologySupplies.filter(item =>
          item.name?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        );
      case 'surgical':
        return surgicalInstruments.filter(item =>
          item.name?.toLowerCase().includes(query) ||
          item.type?.toLowerCase().includes(query)
        );
      case 'linen':
        return linenAndLaundry.filter(item =>
          item.name?.toLowerCase().includes(query) ||
          item.type?.toLowerCase().includes(query)
        );
      case 'waste':
        return wasteManagement.filter(item =>
          item.wasteType?.toLowerCase().includes(query) ||
          item.source?.toLowerCase().includes(query)
        );
      default: return [];
    }
  };

  const filteredItems = getFilteredItems();

  const handleAddSupply = async (event) => {
    event.preventDefault();

    if (!formData.type || !formData.name || !formData.quantity) {
      setErrorMessage('Please select a supply type, enter a name, and set a quantity.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        name: formData.name,
        generic_name: formData.name,
        brand_name: formData.name,
        drug_code: `SUP-${Date.now()}`,
        category: 'other',
        form: 'tablet',
        strength: '',
        stock_quantity: Number(formData.quantity),
        reorder_level: 5,
        reorder_quantity: Number(formData.quantity),
        unit_price: Number(formData.unitCost || 0),
        unit_of_measure: 'piece',
        batch_number: formData.batchNumber || '',
        expiry_date: formData.expiryDate || null,
        supplier: formData.supplier || '',
        storage_conditions: 'Room temperature',
        last_restocked: new Date().toISOString().split('T')[0],
      };

      await apiRequest('/api/v1/pharmacy/drugs/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setFormData({
        type: '',
        name: '',
        quantity: '',
        expiryDate: '',
        supplier: '',
        unitCost: '',
        batchNumber: ''
      });
      setShowModal(false);
      await loadSupplies();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create the supply record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="medical-supplies p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="text-lg font-bold text-gray-800">Medical Supplies</div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Package className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-green-600" />
            Medical Supplies Management
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Consumables, reagents, equipment, and waste tracking</p>
        </div>
        
        {/* Search Bar - Mobile Top */}
        <div className="md:hidden w-full mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Action Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto px-4 py-2.5 md:px-6 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">Add Supply</span>
            <span className="sm:hidden">Add Supply</span>
          </span>
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
          Loading medical supplies from the API...
        </div>
      )}

      {/* Search Bar - Desktop */}
      <div className="hidden md:block mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search in ${activeTab}...`}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-blue-600">
          <div className="flex items-center">
            <Package className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Consumables</p>
              <p className="text-blue-600 font-bold text-lg md:text-xl lg:text-2xl">{consumables.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-green-600">
          <div className="flex items-center">
            <Droplet className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-green-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Lab Reagents</p>
              <p className="text-green-600 font-bold text-lg md:text-xl lg:text-2xl">{laboratoryReagents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-purple-600">
          <div className="flex items-center">
            <Wrench className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Surgical</p>
              <p className="text-purple-600 font-bold text-lg md:text-xl lg:text-2xl">{surgicalInstruments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-red-600">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-red-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Low Stock</p>
              <p className="text-red-600 font-bold text-lg md:text-xl lg:text-2xl">{lowStockConsumables.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-orange-600 col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center">
            <Package className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-orange-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Donations</p>
              <p className="text-orange-600 font-bold text-lg md:text-xl lg:text-2xl">{donations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Categories</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setActiveTab('consumables'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'consumables' ? 'bg-green-100 text-green-600' : 'text-gray-700'
                }`}
              >
                Consumables ({consumables.length})
              </button>
              <button
                onClick={() => { setActiveTab('reagents'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'reagents' ? 'bg-green-100 text-green-600' : 'text-gray-700'
                }`}
              >
                Reagents ({laboratoryReagents.length})
              </button>
              <button
                onClick={() => { setActiveTab('radiology'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'radiology' ? 'bg-green-100 text-green-600' : 'text-gray-700'
                }`}
              >
                Radiology ({radiologySupplies.length})
              </button>
              <button
                onClick={() => { setActiveTab('surgical'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'surgical' ? 'bg-green-100 text-green-600' : 'text-gray-700'
                }`}
              >
                Surgical ({surgicalInstruments.length})
              </button>
              <button
                onClick={() => { setActiveTab('linen'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'linen' ? 'bg-green-100 text-green-600' : 'text-gray-700'
                }`}
              >
                Linen ({linenAndLaundry.length})
              </button>
              <button
                onClick={() => { setActiveTab('waste'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'waste' ? 'bg-green-100 text-green-600' : 'text-gray-700'
                }`}
              >
                Waste ({wasteManagement.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="hidden md:flex gap-2 lg:gap-4 mb-4 lg:mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('consumables')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'consumables'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Consumables ({consumables.length})
        </button>
        <button
          onClick={() => setActiveTab('reagents')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'reagents'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Reagents ({laboratoryReagents.length})
        </button>
        <button
          onClick={() => setActiveTab('radiology')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'radiology'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Radiology ({radiologySupplies.length})
        </button>
        <button
          onClick={() => setActiveTab('surgical')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'surgical'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Surgical ({surgicalInstruments.length})
        </button>
        <button
          onClick={() => setActiveTab('linen')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'linen'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Linen ({linenAndLaundry.length})
        </button>
        <button
          onClick={() => setActiveTab('waste')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'waste'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Waste ({wasteManagement.length})
        </button>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <span className="font-medium text-gray-700">
            {activeTab === 'consumables' && `Consumables (${filteredItems.length})`}
            {activeTab === 'reagents' && `Reagents (${filteredItems.length})`}
            {activeTab === 'radiology' && `Radiology (${filteredItems.length})`}
            {activeTab === 'surgical' && `Surgical (${filteredItems.length})`}
            {activeTab === 'linen' && `Linen (${filteredItems.length})`}
            {activeTab === 'waste' && `Waste (${filteredItems.length})`}
          </span>
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="p-1 rounded-md bg-gray-100"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Empty State Message */}
      {filteredItems.length === 0 && searchQuery && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            No {activeTab} found matching "<span className="font-semibold">{searchQuery}</span>"
          </p>
        </div>
      )}

      {/* Consumables Tab */}
      {activeTab === 'consumables' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No consumables found</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.consumableId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs md:text-sm text-gray-600">Item</p>
                    <p className="font-bold text-sm md:text-base truncate">{item.name || 'Unnamed Item'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Category</p>
                    <p className="font-bold text-xs md:text-sm truncate">{item.category || 'Uncategorized'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">In Stock</p>
                    <p className={`font-bold text-base md:text-lg ${(item.quantityInStock || 0) <= (item.reorderPoint || 0) ? 'text-red-600' : 'text-green-600'}`}>
                      {item.quantityInStock || 0}
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs md:text-sm text-gray-600">Unit Cost</p>
                    <p className="font-bold text-sm">₦{(item.unitCost || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Expiry</p>
                    <p className="font-bold text-xs md:text-sm">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-NG') : 'No Expiry'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className="inline-block px-2 py-1 md:px-3 md:py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                      {item.status || 'Available'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:hidden text-xs text-gray-600">
                  <p><strong>Unit Cost:</strong> ₦{(item.unitCost || 0).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reagents Tab */}
      {activeTab === 'reagents' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center border-l-4 border-green-600">
              <Droplet className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No laboratory reagents found</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.reagentId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-green-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs md:text-sm text-gray-600">Reagent</p>
                    <p className="font-bold text-sm md:text-base truncate">{item.name || 'Unnamed Reagent'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Test Type</p>
                    <p className="font-bold text-xs md:text-sm truncate">{item.testType || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Quantity</p>
                    <p className="font-bold text-base md:text-lg text-green-600">{item.quantityInStock || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Storage</p>
                    <p className="font-bold text-xs md:text-sm">{item.storageTemp || 'Room Temp'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Expiry</p>
                    <p className="font-bold text-xs md:text-sm">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-NG') : 'No Expiry'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Radiology Tab */}
      {activeTab === 'radiology' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No radiology supplies found</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.radiologyId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs md:text-sm text-gray-600">Supply</p>
                    <p className="font-bold text-sm md:text-base truncate">{item.name || 'Unnamed Supply'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Category</p>
                    <p className="font-bold text-xs md:text-sm truncate">{item.category || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Quantity</p>
                    <p className="font-bold text-base md:text-lg">{item.quantity || 0}</p>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs md:text-sm text-gray-600">Unit Cost</p>
                    <p className="font-bold text-sm">₦{(item.unitCost || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className="inline-block px-2 py-1 md:px-3 md:py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                      {item.status || 'Available'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:hidden text-xs text-gray-600">
                  <p><strong>Unit Cost:</strong> ₦{(item.unitCost || 0).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Surgical Tab */}
      {activeTab === 'surgical' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center border-l-4 border-purple-600">
              <Wrench className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No surgical instruments found</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.instrumentId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-purple-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs md:text-sm text-gray-600">Instrument</p>
                    <p className="font-bold text-sm md:text-base truncate">{item.name || 'Unnamed Instrument'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Type</p>
                    <p className="font-bold text-xs md:text-sm truncate">{item.type || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Quantity</p>
                    <p className="font-bold text-base md:text-lg">{item.quantity || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Sterilization</p>
                    <p className="font-bold text-xs md:text-sm">{item.sterilizationStatus || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className="inline-block px-2 py-1 md:px-3 md:py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                      {item.status || 'Available'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Linen Tab */}
      {activeTab === 'linen' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No linen items found</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.linenId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs md:text-sm text-gray-600">Item</p>
                    <p className="font-bold text-sm md:text-base truncate">{item.name || 'Unnamed Item'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Type</p>
                    <p className="font-bold text-xs md:text-sm truncate">{item.type || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Quantity</p>
                    <p className="font-bold text-base md:text-lg">{item.quantity || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Condition</p>
                    <p className="font-bold text-xs md:text-sm">{item.condition || 'Good'}</p>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs md:text-sm text-gray-600">Last Washed</p>
                    <p className="font-bold text-sm">
                      {item.lastWashed ? new Date(item.lastWashed).toLocaleDateString('en-NG') : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className="inline-block px-2 py-1 md:px-3 md:py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                      {item.status || 'Available'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:hidden text-xs text-gray-600">
                  <p><strong>Last Washed:</strong> {item.lastWashed ? new Date(item.lastWashed).toLocaleDateString('en-NG') : 'Never'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Waste Tab */}
      {activeTab === 'waste' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No waste management records found</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.wasteId} className={`rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 ${item.status === 'Pending' ? 'bg-orange-50 border-l-4 border-orange-600' : 'bg-green-50 border-l-4 border-green-600'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs md:text-sm text-gray-600">Type</p>
                    <p className="font-bold text-sm md:text-base truncate">{item.wasteType || 'General Waste'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Date</p>
                    <p className="font-bold text-xs md:text-sm">
                      {item.date ? new Date(item.date).toLocaleDateString('en-NG') : 'No Date'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Quantity</p>
                    <p className="font-bold text-base md:text-lg">{item.quantity || 0} {item.unit || 'units'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Source</p>
                    <p className="font-bold text-xs md:text-sm truncate">{item.source || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className={`inline-block px-2 py-1 md:px-3 md:py-1 rounded text-xs font-semibold ${item.status === 'Pending' ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                      {item.status || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <GenericModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Supply"
        size="lg"
      >
        <form onSubmit={handleAddSupply} className="space-y-3 md:space-y-4">
          <select
            value={formData.type}
            onChange={(event) => setFormData({ ...formData, type: event.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base"
          >
            <option value="">Select Supply Type</option>
            <option value="consumables">Consumable</option>
            <option value="reagents">Reagent</option>
            <option value="radiology">Radiology Supply</option>
            <option value="surgical">Surgical Instrument</option>
            <option value="linen">Linen</option>
          </select>
          <input
            type="text"
            placeholder="Item Name"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(event) => setFormData({ ...formData, quantity: event.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base"
          />
          <input
            type="number"
            placeholder="Unit Cost"
            value={formData.unitCost}
            onChange={(event) => setFormData({ ...formData, unitCost: event.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Supplier"
            value={formData.supplier}
            onChange={(event) => setFormData({ ...formData, supplier: event.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Batch Number"
            value={formData.batchNumber}
            onChange={(event) => setFormData({ ...formData, batchNumber: event.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base"
          />
          <input
            type="date"
            placeholder="Expiry Date"
            value={formData.expiryDate}
            onChange={(event) => setFormData({ ...formData, expiryDate: event.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base"
          />
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-green-700 font-medium text-sm md:text-base transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Add Supply'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </GenericModal>
    </div>
  );
};

export default MedicalSupplies;