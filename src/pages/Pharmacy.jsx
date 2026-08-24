import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package, Search, Filter, Plus, Edit, Trash2, AlertTriangle,
  Download, Upload, BarChart3, Pill, Shield, Clock, TrendingUp,
  AlertCircle, CheckCircle, XCircle, ShoppingCart, History,
  Eye, FileText, Calculator, Printer, Calendar, Tag,
  X, ChevronLeft, ChevronRight, MoreVertical,
  Layers, Box, Truck, DollarSign, Users,
  Clipboard, BookOpen, Award, ShieldCheck,
  Menu, Grid, List, Receipt, User, Building2,
  RefreshCw, Loader2, ArrowUp, ArrowDown, Info,
  ChevronDown, Check, PlusCircle
} from 'lucide-react';
import {
  addDrug, updateDrug, deleteDrug, dispenseDrug,
  restockDrug, searchDrugs, filterDrugs, sortDrugs,
  setCurrentDrug, archiveDrug, exportPharmacyReport,
  checkDrugInteraction, generatePrescription,
  addToCart, removeFromCart, clearCart, processSale,
  fetchDrugs, fetchSuppliers, fetchSales, fetchPrescriptions,
  setSuppliers, setSales, setPrescriptions
} from '../features/pharmacySlice';
import ConfirmModal from '../components/ConfirmModal';
import { apiRequest, pharmacyApi } from '../utils/api';

// ==================== REUSABLE COMPONENTS ====================

const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false, size = 'sm' }) => {
  const variants = {
    default: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
    primary: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
    danger: 'text-rose-600 hover:text-rose-700 hover:bg-rose-50',
    warning: 'text-amber-600 hover:text-amber-700 hover:bg-amber-50',
    success: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      title={tooltip}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, size = 'md', type = 'button', icon: Icon }) => {
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
    ghost: 'hover:bg-gray-100 text-gray-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

const Badge = ({ status, children }) => {
  const colors = {
    'active': 'bg-emerald-100 text-emerald-700',
    'in-stock': 'bg-emerald-100 text-emerald-700',
    'low-stock': 'bg-amber-100 text-amber-700',
    'low': 'bg-amber-100 text-amber-700',
    'out-of-stock': 'bg-rose-100 text-rose-700',
    'expired': 'bg-rose-100 text-rose-700',
    'controlled': 'bg-purple-100 text-purple-700',
    'pending': 'bg-amber-100 text-amber-700',
    'dispensed': 'bg-emerald-100 text-emerald-700',
    'completed': 'bg-emerald-100 text-emerald-700',
    'inactive': 'bg-gray-100 text-gray-600',
    'cash': 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors['active']}`}>
      {children}
    </span>
  );
};

const StatsCard = ({ title, value, icon: Icon, color, trend, trendValue, onClick }) => {
  const colorClasses = {
    green: 'bg-emerald-500',
    gold: 'bg-amber-500',
    red: 'bg-rose-500',
    warm: 'bg-amber-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500',
    blue: 'bg-blue-500',
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1_000_000_000) return `₦${(val / 1_000_000_000).toFixed(1)}B`;
      if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
      if (val >= 1_000) return `₦${(val / 1_000).toFixed(1)}K`;
      return `₦${val.toLocaleString()}`;
    }
    return val;
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-emerald-200' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{formatValue(value)}</p>
          {trend && (
            <div className={`flex items-center mt-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend === 'up' ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`w-10 h-10 ${colorClasses[color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

// ==================== MODAL COMPONENTS ====================

const BaseModal = ({ isOpen, onClose, title, children, maxWidth = '2xl' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl',
    full: 'max-w-6xl',
  };

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
          onClick={handleBackdropClick}
        />
        
        {/* Modal */}
        <div className={`relative w-full ${sizes[maxWidth]} bg-white rounded-2xl shadow-2xl transform transition-all duration-300 animate-in fade-in zoom-in`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

const DrugFormModal = ({ isOpen, onClose, onSubmit, initialData, loading, isEdit }) => {
  const [formData, setFormData] = useState(initialData || getDefaultDrugForm());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(getDefaultDrugForm());
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Drug' : 'Add New Drug'} maxWidth="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
            <input
              type="text"
              name="genericName"
              value={formData.genericName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              required
            >
              <option value="">Select Category</option>
              {drugCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form *</label>
            <select
              name="dosageForm"
              value={formData.dosageForm}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              required
            >
              <option value="">Select Form</option>
              {dosageForms.map(form => (
                <option key={form.value} value={form.value}>{form.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
            <input
              type="text"
              name="strength"
              value={formData.strength}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              placeholder="e.g., 500mg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
            <select
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            >
              <option value="">Select Manufacturer</option>
              {nigerianManufacturers.map(man => (
                <option key={man} value={man}>{man}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing & Inventory</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (₦)</label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₦)</label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Stock</label>
              <input
                type="number"
                name="quantityInStock"
                value={formData.quantityInStock}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Regulatory */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Regulatory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NAFDAC Number</label>
              <input
                type="text"
                name="nafdacNumber"
                value={formData.nafdacNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                placeholder="NAFDAC-04-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NEML Category</label>
              <select
                name="nemlCategory"
                value={formData.nemlCategory}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              >
                <option value="">Select Category</option>
                {nemlCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="controlledSubstance"
                checked={formData.controlledSubstance}
                onChange={handleChange}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Controlled Substance
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="prescriptionRequired"
                checked={formData.prescriptionRequired}
                onChange={handleChange}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Prescription Required
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="nhisCovered"
                checked={formData.nhisCovered}
                onChange={handleChange}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              NHIS Covered
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
            icon={Check}
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Drug' : 'Add Drug')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

const SupplierFormModal = ({ isOpen, onClose, onSubmit, initialData, loading, isEdit }) => {
  const [formData, setFormData] = useState(initialData || getDefaultSupplierForm());

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(getDefaultSupplierForm());
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Supplier' : 'Add New Supplier'} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              rows="2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              min="0"
              max="5"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              rows="2"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <Button type="submit" variant="primary" className="flex-1" disabled={loading} icon={Check}>
            {loading ? 'Saving...' : (isEdit ? 'Update Supplier' : 'Add Supplier')}
          </Button>
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

const RestockModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({ quantity: '', batchNumber: '', expiryDate: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Restock Inventory" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
          <input
            type="text"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <Button type="submit" variant="primary" className="flex-1" disabled={loading} icon={Package}>
            {loading ? 'Restocking...' : 'Restock'}
          </Button>
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

const CartModal = ({ isOpen, onClose, items, onRemove, onCheckout, loading }) => {
  const total = items.reduce((sum, item) => sum + (item.quantity * (item.selling_price || item.sellingPrice || 0)), 0);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Cart (${items.length} items)`} maxWidth="md">
      {items.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × ₦{item.selling_price || item.sellingPrice || 0}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className="text-sm font-semibold text-gray-900">
                    ₦{(item.quantity * (item.selling_price || item.sellingPrice || 0)).toLocaleString()}
                  </span>
                  <IconButton
                    icon={Trash2}
                    onClick={() => onRemove(index)}
                    tooltip="Remove"
                    variant="danger"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between mb-4">
              <span className="font-medium text-gray-700">Total:</span>
              <span className="text-xl font-bold text-gray-900">₦{total.toLocaleString()}</span>
            </div>
            <Button
              onClick={onCheckout}
              variant="primary"
              className="w-full justify-center"
              disabled={loading || items.length === 0}
              icon={ShoppingCart}
            >
              {loading ? 'Processing...' : 'Process Sale'}
            </Button>
          </div>
        </>
      )}
    </BaseModal>
  );
};

// ==================== PRESCRIPTION PATIENT MODAL ====================

const PrescriptionPatientModal = ({ patient, onClose, onDispense, drugs }) => {
  const [dispensingPrescription, setDispensingPrescription] = useState(null);
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [dispenseQuantity, setDispenseQuantity] = useState(1);
  const [isDispensing, setIsDispensing] = useState(false);

  if (!patient) return null;

  const handleDispense = async (prescription) => {
    if (!selectedDrugId || !dispenseQuantity) {
      return;
    }

    setIsDispensing(true);
    try {
      await onDispense(prescription, selectedDrugId, dispenseQuantity);
      setDispensingPrescription(null);
      setSelectedDrugId('');
      setDispenseQuantity(1);
    } catch (error) {
      console.error('Dispense error:', error);
    } finally {
      setIsDispensing(false);
    }
  };

  const startDispense = (prescription) => {
    setDispensingPrescription(prescription);
    // Auto-select matching drug if available
    const matchingDrug = drugs.find(drug => 
      [drug.name, drug.generic_name, drug.genericName, drug.brand_name, drug.brandName]
        .filter(Boolean)
        .some(name => name.toLowerCase() === prescription.drug_name.toLowerCase())
    );
    if (matchingDrug) {
      setSelectedDrugId(String(matchingDrug.id));
    } else {
      setSelectedDrugId('');
    }
    setDispenseQuantity(1);
  };

  const cancelDispense = () => {
    setDispensingPrescription(null);
    setSelectedDrugId('');
    setDispenseQuantity(1);
  };

  return (
    <BaseModal isOpen={!!patient} onClose={onClose} title={patient.name} maxWidth="lg">
      <div className="space-y-1 mb-4">
        <p className="text-sm text-gray-500">MRN: {patient.mrn || 'N/A'} · {patient.items.length} prescription(s)</p>
      </div>

      {/* Dispense Form */}
      {dispensingPrescription && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Dispensing: {dispensingPrescription.drug_name}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Select Drug</label>
              <select
                value={selectedDrugId}
                onChange={(e) => setSelectedDrugId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Select inventory drug</option>
                {drugs.filter((drug) => 
                  [drug.name, drug.generic_name, drug.genericName, drug.brand_name, drug.brandName]
                    .filter(Boolean)
                    .some((name) => name.toLowerCase() === dispensingPrescription.drug_name.toLowerCase())
                ).map((drug) => (
                  <option key={drug.id} value={drug.id}>
                    {drug.name} ({drug.stock_quantity ?? drug.quantityInStock ?? 0} in stock)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={dispenseQuantity}
                onChange={(e) => setDispenseQuantity(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={() => handleDispense(dispensingPrescription)}
                disabled={isDispensing || !selectedDrugId || !dispenseQuantity}
                variant="success"
                size="sm"
                icon={CheckCircle}
              >
                {isDispensing ? 'Dispensing...' : 'Dispense'}
              </Button>
              <Button
                onClick={cancelDispense}
                variant="secondary"
                size="sm"
                icon={X}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription List */}
      <div className="divide-y divide-gray-100">
        {patient.items.map((prescription) => {
          const isDispensed = prescription.status === 'dispensed' || prescription.status === 'completed';
          return (
            <div key={prescription.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{prescription.drug_name || prescription.drug?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">
                  {prescription.dosage || 'Dose not recorded'} · {prescription.frequency || 'Frequency not recorded'} · Qty: {prescription.quantity || 1}
                </p>
                <p className="text-xs text-gray-400">
                  Batch: {prescription.visit_number || prescription.visit || 'Visit batch'} · {prescription.prescribed_date ? new Date(prescription.prescribed_date).toLocaleDateString() : 'Date unavailable'}
                </p>
                <p className="text-xs text-gray-400">
                  Prescribed by: {prescription.prescribed_by_name || 'Doctor not recorded'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge status={prescription.status || 'pending'}>
                  {prescription.status || 'Pending'}
                </Badge>
                {!isDispensed && (
                  <Button
                    onClick={() => startDispense(prescription)}
                    variant="success"
                    size="sm"
                    icon={ShoppingCart}
                  >
                    Dispense
                  </Button>
                )}
                {isDispensed && (
                  <Badge status="dispensed">✓ Dispensed</Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </BaseModal>
  );
};

// ==================== CONSTANTS ====================

const drugCategories = [
  { value: 'antibiotic', label: 'Antibiotic' },
  { value: 'analgesic', label: 'Analgesic' },
  { value: 'antihypertensive', label: 'Antihypertensive' },
  { value: 'antidiabetic', label: 'Antidiabetic' },
  { value: 'antimalarial', label: 'Antimalarial' },
  { value: 'vaccine', label: 'Vaccine' },
  { value: 'supplement', label: 'Supplement' },
  { value: 'other', label: 'Other' }
];

const dosageForms = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'syrup', label: 'Syrup' },
  { value: 'injection', label: 'Injection' },
  { value: 'ointment', label: 'Ointment' },
  { value: 'cream', label: 'Cream' },
  { value: 'drops', label: 'Drops' },
  { value: 'inhaler', label: 'Inhaler' },
  { value: 'suppository', label: 'Suppository' }
];

const nemlCategories = ['Essential-Core', 'Essential-Complementary', 'Specialist', 'Supplementary', 'Not-in-NEML'];

const nigerianManufacturers = [
  'Emzor Pharmaceuticals', 'Fidson Healthcare', 'May & Baker Nigeria',
  'Swiss Pharma Nigeria', 'Chi Pharmaceuticals', 'Greenlife Pharmaceuticals',
  'Mopson Pharmaceuticals', 'Biotech Pharmaceuticals', 'GSK Nigeria',
  'Sanofi Nigeria', 'Pfizer Nigeria', 'Other'
];

const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
  { value: 'expired', label: 'Expired' },
  { value: 'controlled', label: 'Controlled' },
];

const tabs = [
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'prescriptions', label: 'Prescriptions', icon: Clipboard },
  { id: 'sales', label: 'Sales', icon: History },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
];

// ==================== DEFAULT FORM VALUES ====================

const getDefaultDrugForm = () => ({
  name: '', genericName: '', brandName: '', drugCode: '', nafdacNumber: '',
  pcnApprovalNumber: '', strength: '', dosageForm: '', unitOfMeasure: '',
  category: '', therapeuticClass: '', manufacturer: '', supplier: '',
  countryOfOrigin: 'Nigeria', unitPrice: '', sellingPrice: '', quantityInStock: '',
  reorderLevel: '', reorderQuantity: '', expiryDate: '', batchNumber: '',
  storageConditions: '', prescriptionRequired: false, controlledSubstance: false,
  narcotic: false, schedule: '', nhisCovered: false, nhisCode: '', nhisPrice: '',
  nemlCategory: '', sideEffects: '', contraindications: '', interactions: '',
  dosageInstructions: '', barcode: '', lastRestocked: new Date().toISOString().split('T')[0]
});

const getDefaultSupplierForm = () => ({
  name: '', contactPerson: '', phone: '', email: '', address: '',
  licenseNumber: '', rating: 0, notes: ''
});

// ==================== MAIN COMPONENT ====================

const Pharmacy = () => {
  const dispatch = useDispatch();
  const pharmacyState = useSelector(state => state.pharmacy) || {};
  
  const {
    drugs = [], filteredDrugs = [], currentDrug = null,
    loading = false, error = null, searchTerm = '',
    filterBy = 'all', sortBy = 'name', cart = [],
    salesHistory = [], lowStockItems = [], expiredDrugs = [],
    prescriptions = [], inventoryValue = 0, suppliers = []
  } = pharmacyState;

  // UI State
  const [activeTab, setActiveTab] = useState('inventory');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [prescriptionSearch, setPrescriptionSearch] = useState('');

  // Modal States
  const [modals, setModals] = useState({
    drugForm: { isOpen: false, isEdit: false, data: null },
    supplierForm: { isOpen: false, isEdit: false, data: null },
    restock: { isOpen: false, drugId: null },
    cart: { isOpen: false },
    prescriptions: { isOpen: false, patient: null },
    confirm: { isOpen: false, title: '', message: '', onConfirm: null },
  });

  // Form States
  const [drugForm, setDrugForm] = useState(getDefaultDrugForm());
  const [supplierForm, setSupplierForm] = useState(getDefaultSupplierForm());
  const [restockForm, setRestockForm] = useState({ quantity: '', batchNumber: '', expiryDate: '' });
  const [dispenseSelection, setDispenseSelection] = useState(null);
  const [dispenseQuantity, setDispenseQuantity] = useState('');
  const [isDispensing, setIsDispensing] = useState(false);

  // Notification States
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const itemsPerPage = 10;

  // Stats
  const stats = useMemo(() => {
    const safeDrugs = drugs || [];
    const totalDrugs = safeDrugs.length;
    const totalValue = safeDrugs.reduce((sum, drug) => 
      sum + (drug.stock_quantity || drug.quantityInStock || 0) * (drug.unit_price || drug.unitPrice || 0), 0);
    const lowStockCount = safeDrugs.filter(drug => 
      (drug.stock_quantity || drug.quantityInStock || 0) <= (drug.reorder_level || drug.reorderLevel || 0)).length;
    const expiredCount = safeDrugs.filter(drug => 
      new Date(drug.expiry_date || drug.expiryDate) < new Date()).length;
    const controlledCount = safeDrugs.filter(drug => 
      drug.is_controlled || drug.controlledSubstance).length;
    const activeCount = safeDrugs.filter(drug => drug.status === 'active' || drug.status !== 'inactive').length;

    return { totalDrugs, totalValue, lowStockCount, expiredCount, controlledCount, activeCount };
  }, [drugs]);

  // Get drug status
  const getStatus = useCallback((drug) => {
    const qty = drug.stock_quantity || drug.quantityInStock || 0;
    const reorder = drug.reorder_level || drug.reorderLevel || 0;
    const isExpired = new Date(drug.expiry_date || drug.expiryDate) < new Date();
    
    if (isExpired) return 'expired';
    if (qty === 0) return 'out-of-stock';
    if (qty <= reorder) return 'low-stock';
    if (drug.is_controlled || drug.controlledSubstance) return 'controlled';
    return 'in-stock';
  }, []);

  // Filter and paginate
  const filteredByStatus = useMemo(() => {
    const safeFilteredDrugs = filteredDrugs || [];
    if (statusFilter === 'all') return safeFilteredDrugs;
    return safeFilteredDrugs.filter(drug => getStatus(drug) === statusFilter);
  }, [filteredDrugs, statusFilter, getStatus]);

  const totalItems = filteredByStatus.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDrugs = filteredByStatus.slice(startIndex, startIndex + itemsPerPage);

  // Prescription patients
  const prescriptionPatients = useMemo(() => {
    const groups = new Map();
    (prescriptions || []).forEach((prescription) => {
      const patientId = prescription.patient || prescription.patient_name || 'unknown';
      if (!groups.has(patientId)) {
        groups.set(patientId, {
          id: patientId,
          name: prescription.patient_name || 'Unknown',
          mrn: prescription.patient_mrn || '',
          items: [],
        });
      }
      groups.get(patientId).items.push(prescription);
    });
    return Array.from(groups.values()).map((patient) => ({
      ...patient,
      items: patient.items.sort((a, b) => new Date(b.prescribed_date || 0) - new Date(a.prescribed_date || 0)),
    })).map((patient) => ({
      ...patient,
      latest: patient.items[0],
    })).sort((a, b) => new Date(b.latest?.prescribed_date || 0) - new Date(a.latest?.prescribed_date || 0));
  }, [prescriptions]);

  // Fetch data
  useEffect(() => {
    dispatch(fetchDrugs());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'prescriptions') {
      dispatch(fetchPrescriptions({ search: prescriptionSearch }));
    } else if (activeTab === 'sales') {
      dispatch(fetchSales());
    } else if (activeTab === 'suppliers') {
      dispatch(fetchSuppliers());
    }
  }, [activeTab, dispatch, prescriptionSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // ==================== HANDLERS ====================

  const handleDrugFormSubmit = async (formData) => {
    setErrorMessage('');
    try {
      const payload = {
        name: formData.name.trim(),
        generic_name: formData.genericName.trim() || null,
        brand_name: formData.brandName.trim() || null,
        drug_code: formData.drugCode.trim() || null,
        nafdac_number: formData.nafdacNumber.trim() || null,
        pcn_approval_number: formData.pcnApprovalNumber.trim() || null,
        strength: formData.strength.trim() || null,
        form: formData.dosageForm,
        category: formData.category,
        therapeutic_class: formData.therapeuticClass.trim() || null,
        stock_quantity: parseInt(formData.quantityInStock) || 0,
        reorder_level: parseInt(formData.reorderLevel) || 10,
        reorder_quantity: parseInt(formData.reorderQuantity) || 0,
        unit_price: parseFloat(formData.unitPrice) || 0,
        selling_price: parseFloat(formData.sellingPrice) || 0,
        unit_of_measure: formData.unitOfMeasure.trim() || null,
        batch_number: formData.batchNumber.trim() || null,
        expiry_date: formData.expiryDate || null,
        storage_conditions: formData.storageConditions.trim() || null,
        last_restocked: formData.lastRestocked || null,
        neml_category: formData.nemlCategory || null,
        manufacturer: formData.manufacturer.trim() || null,
        supplier: formData.supplier.trim() || null,
        country_of_origin: formData.countryOfOrigin.trim() || 'Nigeria',
        is_controlled: formData.controlledSubstance,
        narcotic: formData.narcotic,
        schedule: formData.schedule.trim() || null,
        nhis_covered: formData.nhisCovered,
        nhis_code: formData.nhisCode.trim() || null,
        nhis_price: formData.nhisPrice ? parseFloat(formData.nhisPrice) : null,
        side_effects: formData.sideEffects.trim() || null,
        contraindications: formData.contraindications.trim() || null,
        interactions: formData.interactions.trim() || null,
        dosage_instructions: formData.dosageInstructions.trim() || null,
        prescription_required: formData.prescriptionRequired,
        barcode: formData.barcode.trim() || null,
      };

      if (modals.drugForm.isEdit) {
        await apiRequest(`/api/v1/pharmacy/drugs/${modals.drugForm.data.id}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setSuccessMessage('Drug updated successfully.');
      } else {
        await apiRequest('/api/v1/pharmacy/drugs/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccessMessage('Drug added successfully.');
      }

      dispatch(fetchDrugs());
      closeModal('drugForm');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      let errorMsg = err.message || 'Failed to save drug.';
      if (err.data && typeof err.data === 'object') {
        errorMsg = Object.entries(err.data)
          .map(([field, errors]) => {
            const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const msg = Array.isArray(errors) ? errors.join(', ') : errors;
            return `${fieldLabel}: ${msg}`;
          })
          .join('\n');
      }
      setErrorMessage(errorMsg);
    }
  };

  const handleEditDrug = async (drug) => {
    try {
      const freshDrug = await apiRequest(`/api/v1/pharmacy/drugs/${drug.id}/`);
      const formData = {
        name: freshDrug.name || '',
        genericName: freshDrug.generic_name || '',
        brandName: freshDrug.brand_name || '',
        drugCode: freshDrug.drug_code || '',
        nafdacNumber: freshDrug.nafdac_number || '',
        pcnApprovalNumber: freshDrug.pcn_approval_number || '',
        strength: freshDrug.strength || '',
        dosageForm: freshDrug.form || '',
        unitOfMeasure: freshDrug.unit_of_measure || '',
        category: freshDrug.category || '',
        therapeuticClass: freshDrug.therapeutic_class || '',
        manufacturer: freshDrug.manufacturer || '',
        supplier: freshDrug.supplier || '',
        countryOfOrigin: freshDrug.country_of_origin || 'Nigeria',
        unitPrice: freshDrug.unit_price ? String(freshDrug.unit_price) : '',
        sellingPrice: freshDrug.selling_price ? String(freshDrug.selling_price) : '',
        quantityInStock: freshDrug.stock_quantity ? String(freshDrug.stock_quantity) : '',
        reorderLevel: freshDrug.reorder_level ? String(freshDrug.reorder_level) : '',
        reorderQuantity: freshDrug.reorder_quantity ? String(freshDrug.reorder_quantity) : '',
        expiryDate: freshDrug.expiry_date || '',
        batchNumber: freshDrug.batch_number || '',
        storageConditions: freshDrug.storage_conditions || '',
        prescriptionRequired: freshDrug.prescription_required || false,
        controlledSubstance: freshDrug.is_controlled || false,
        narcotic: freshDrug.narcotic || false,
        schedule: freshDrug.schedule || '',
        nhisCovered: freshDrug.nhis_covered || false,
        nhisCode: freshDrug.nhis_code || '',
        nhisPrice: freshDrug.nhis_price ? String(freshDrug.nhis_price) : '',
        nemlCategory: freshDrug.neml_category || '',
        sideEffects: freshDrug.side_effects || '',
        contraindications: freshDrug.contraindications || '',
        interactions: freshDrug.interactions || '',
        dosageInstructions: freshDrug.dosage_instructions || '',
        barcode: freshDrug.barcode || '',
        lastRestocked: freshDrug.last_restocked || new Date().toISOString().split('T')[0],
      };
      setDrugForm(formData);
      openModal('drugForm', { isEdit: true, data: freshDrug });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load drug details');
    }
  };

  const handleDeleteClick = (drug) => {
    setModals(prev => ({
      ...prev,
      confirm: {
        isOpen: true,
        title: 'Delete Drug',
        message: `Are you sure you want to delete "${drug.name}"? This action cannot be undone.`,
        onConfirm: async () => {
          try {
            await apiRequest(`/api/v1/pharmacy/drugs/${drug.id}/`, { method: 'DELETE' });
            dispatch(fetchDrugs());
            setSuccessMessage('Drug deleted successfully.');
            setTimeout(() => setSuccessMessage(''), 3000);
            closeModal('confirm');
          } catch (err) {
            setErrorMessage(err.message || 'Failed to delete drug');
          }
        }
      }
    }));
  };

  const handleRestockSubmit = async (formData) => {
    setErrorMessage('');
    try {
      await apiRequest(`/api/v1/pharmacy/drugs/${modals.restock.drugId}/restock/`, {
        method: 'POST',
        body: JSON.stringify({
          quantity: parseInt(formData.quantity),
          batch_number: formData.batchNumber,
          expiry_date: formData.expiryDate,
        }),
      });
      dispatch(fetchDrugs());
      closeModal('restock');
      setSuccessMessage('Drug restocked successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to restock drug');
    }
  };

  const handleSupplierSubmit = async (formData) => {
    setErrorMessage('');
    try {
      const payload = {
        name: formData.name.trim(),
        contact_person: formData.contactPerson.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        license_number: formData.licenseNumber.trim() || null,
        rating: parseInt(formData.rating) || 0,
        notes: formData.notes.trim() || null,
      };

      if (modals.supplierForm.isEdit) {
        await apiRequest(`/api/v1/pharmacy/suppliers/${modals.supplierForm.data.id}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setSuccessMessage('Supplier updated successfully.');
      } else {
        await apiRequest('/api/v1/pharmacy/suppliers/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccessMessage('Supplier added successfully.');
      }

      dispatch(fetchSuppliers());
      closeModal('supplierForm');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save supplier');
    }
  };

  const handleDispensePrescription = async (prescription, drugId, quantity) => {
    setErrorMessage('');
    try {
      const drug = drugs.find((item) => item.id === Number(drugId));
      if (!drug) throw new Error('Select an inventory item that matches this prescription.');
      
      await pharmacyApi.createDispense({
        prescription: prescription.id,
        patient: prescription.patient,
        drug: drug.id,
        quantity: quantity,
        unit_price: drug.selling_price || drug.sellingPrice || 0,
        instructions: prescription.instructions || ''
      });
      
      setSuccessMessage('Prescription dispensed and stock updated.');
      dispatch(fetchPrescriptions({ search: prescriptionSearch }));
      dispatch(fetchDrugs());
      
      // Refresh the patient data in the modal
      const updatedPatients = prescriptionPatients;
      const currentPatient = updatedPatients.find(p => p.id === modals.prescriptions.patient?.id);
      if (currentPatient) {
        openModal('prescriptions', { patient: currentPatient });
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to dispense prescription.');
      throw error;
    }
  };

  const handleAddToCart = (drug) => {
    dispatch(addToCart({
      ...drug,
      quantity: 1,
      totalPrice: drug.selling_price || drug.sellingPrice || drug.unit_price || drug.unitPrice || 0
    }));
    setSuccessMessage(`${drug.name} added to cart.`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleProcessSale = async () => {
    const safeCart = cart || [];
    if (safeCart.length === 0) {
      setErrorMessage('Cart is empty.');
      return;
    }

    try {
      const payload = {
        payment_method: 'cash',
        payment_status: 'paid',
        status: 'completed',
        items: safeCart.map(item => ({
          drug: item.id,
          quantity: item.quantity,
          unit_price: item.selling_price || item.sellingPrice || item.unit_price || item.unitPrice || 0,
        })),
      };

      await apiRequest('/api/v1/pharmacy/sales/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      dispatch(clearCart());
      dispatch(fetchDrugs());
      dispatch(fetchSales());
      closeModal('cart');
      setSuccessMessage('Sale processed successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process sale');
    }
  };

  const handleExportReport = () => {
    dispatch(exportPharmacyReport());
    setSuccessMessage('Report exported successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRefresh = () => {
    dispatch(fetchDrugs());
    setSuccessMessage('Inventory refreshed.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // ==================== MODAL HELPERS ====================

  const openModal = (modalName, props = {}) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { ...prev[modalName], ...props, isOpen: true }
    }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { ...prev[modalName], isOpen: false }
    }));
  };

  // ==================== RENDER HELPERS ====================

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  // ==================== RENDER FUNCTIONS ====================

  const renderInventoryContent = () => {
    return (
      <>
        {/* Alerts */}
        {(lowStockItems.length > 0 || expiredDrugs.length > 0) && (
          <div className="px-4 pt-4 space-y-2">
            {lowStockItems.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="text-sm text-amber-700">
                  <span className="font-semibold">{lowStockItems.length}</span> drug(s) below reorder level
                </span>
              </div>
            )}
            {expiredDrugs.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span className="text-sm text-rose-700">
                  <span className="font-semibold">{expiredDrugs.length}</span> drug(s) have expired
                </span>
              </div>
            )}
          </div>
        )}

        {/* Drug List */}
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
              <p className="text-gray-500">Loading inventory...</p>
            </div>
          ) : displayedDrugs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No drugs found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery ? 'Try adjusting your search' : 'Click "Add Drug" to get started'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {displayedDrugs.map((drug) => {
                      const status = getStatus(drug);
                      const qty = drug.stock_quantity || drug.quantityInStock || 0;
                      const expiryDate = drug.expiry_date || drug.expiryDate;
                      const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;
                      
                      return (
                        <tr key={drug.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{drug.name}</p>
                              <p className="text-sm text-gray-500">{drug.generic_name || drug.genericName}</p>
                              <p className="text-xs text-gray-400">
                                {drug.strength} • {drug.form || drug.dosageForm}
                              </p>
                              {drug.neml_category && (
                                <Badge status="active" className="mt-1">
                                  {drug.neml_category}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 hidden sm:table-cell">
                            <div className="font-medium text-gray-900">{qty}</div>
                            <div className="text-xs text-gray-500">Reorder: {drug.reorder_level || drug.reorderLevel || 0}</div>
                            {drug.batch_number && (
                              <div className="text-xs text-gray-400">Batch: {drug.batch_number}</div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-medium text-gray-900">₦{drug.selling_price || drug.sellingPrice || 0}</div>
                            <div className="text-xs text-gray-400 hidden sm:block">Cost: ₦{drug.unit_price || drug.unitPrice || 0}</div>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell">
                            <Badge status={status}>{status.replace('-', ' ')}</Badge>
                            {!isExpired && expiryDate && (
                              <div className="text-xs text-gray-400 mt-1">{formatDate(expiryDate)}</div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-0.5">
                              <IconButton icon={Edit} onClick={() => handleEditDrug(drug)} tooltip="Edit" variant="warning" size="sm" />
                              <IconButton icon={Trash2} onClick={() => handleDeleteClick(drug)} tooltip="Delete" variant="danger" size="sm" />
                              <IconButton icon={Package} onClick={() => {
                                setRestockForm({ quantity: '', batchNumber: '', expiryDate: '' });
                                setModals(prev => ({ ...prev, restock: { isOpen: true, drugId: drug.id } }));
                              }} tooltip="Restock" variant="primary" size="sm" />
                              {/* <IconButton icon={ShoppingCart} onClick={() => handleAddToCart(drug)} tooltip="Add to Cart QWERTY" variant="success" size="sm" /> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-3">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
                </div>
                <div className="flex items-center gap-2">
                  <IconButton
                    icon={ChevronLeft}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    tooltip="Previous"
                    disabled={currentPage === 1}
                    size="sm"
                  />
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    tooltip="Next"
                    disabled={currentPage === totalPages}
                    size="sm"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const renderPrescriptionsContent = () => {
    return (
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Prescriptions</h3>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={prescriptionSearch}
                onChange={(e) => setPrescriptionSearch(e.target.value)}
                placeholder="Search by patient..."
                className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all w-full sm:w-56"
              />
            </div>
            <Button variant="secondary" size="sm" icon={Filter}>Filter</Button>
            <Button variant="secondary" size="sm" icon={Download}>Export</Button>
          </div>
        </div>

        {dispenseSelection && (
          <form onSubmit={handleDispensePrescription} className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
              <div>
                <p className="text-sm font-semibold text-gray-900">Dispense {dispenseSelection.prescription.drug_name}</p>
                <p className="text-sm text-gray-600">{dispenseSelection.prescription.patient_name}</p>
                <select
                  value={dispenseSelection.drugId}
                  onChange={(e) => setDispenseSelection((current) => ({ ...current, drugId: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Select inventory drug</option>
                  {drugs.filter((drug) => 
                    [drug.name, drug.generic_name, drug.genericName, drug.brand_name, drug.brandName]
                      .filter(Boolean)
                      .some((name) => name.toLowerCase() === dispenseSelection.prescription.drug_name.toLowerCase())
                  ).map((drug) => (
                    <option key={drug.id} value={drug.id}>
                      {drug.name} ({drug.stock_quantity ?? drug.quantityInStock ?? 0} in stock)
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                min="1"
                value={dispenseQuantity}
                onChange={(e) => setDispenseQuantity(e.target.value)}
                placeholder="Qty"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isDispensing || !dispenseSelection.drugId || !dispenseQuantity} variant="success" icon={CheckCircle}>
                  Dispense
                </Button>
                <Button type="button" variant="secondary" onClick={() => setDispenseSelection(null)} icon={X}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <p className="text-gray-500">Loading prescriptions...</p>
          </div>
        ) : prescriptionPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Clipboard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No prescriptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Batch</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Prescribed By</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {prescriptionPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3">
                      <span className="font-medium text-gray-900">{patient.name}</span>
                      <span className="block text-xs text-gray-400">MRN: {patient.mrn || 'N/A'}</span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600">
                      {patient.latest?.visit_number || patient.latest?.visit || 'Visit batch'}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {patient.latest?.prescribed_date ? new Date(patient.latest.prescribed_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 hidden lg:table-cell">
                      {patient.latest?.prescribed_by_name || 'Doctor not recorded'}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600">{patient.items.length}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-0.5">
                        <IconButton 
                          icon={Eye} 
                          tooltip="View Details" 
                          variant="primary" 
                          size="sm" 
                          onClick={() => openModal('prescriptions', { patient })}
                        />
                        <IconButton icon={Printer} tooltip="Print" variant="default" size="sm" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSalesContent = () => {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Sales History</h3>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportReport} variant="secondary" size="sm" icon={Download}>
              Export
            </Button>
            <Button variant="primary" size="sm" icon={BarChart3}>
              Analytics
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <p className="text-gray-500">Loading sales...</p>
          </div>
        ) : salesHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No sales found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {salesHistory.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {sale.patient_name || sale.patient?.get_full_name || 'Walk-in Customer'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-medium text-gray-900">
                      ₦{parseFloat(sale.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 hidden sm:table-cell">
                      {sale.sold_at ? formatDate(sale.sold_at) : '-'}
                    </td>
                    <td className="px-3 py-3">
                      <Badge status={sale.payment_method || 'cash'}>
                        {sale.payment_method || 'Cash'}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-0.5">
                        <IconButton icon={Receipt} tooltip="Receipt" variant="primary" size="sm" />
                        <IconButton icon={Printer} tooltip="Print" variant="default" size="sm" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSuppliersContent = () => {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Suppliers</h3>
          <Button onClick={() => {
            setSupplierForm(getDefaultSupplierForm());
            openModal('supplierForm', { isEdit: false, data: null });
          }} variant="primary" size="sm" icon={Plus}>
            Add Supplier
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <p className="text-gray-500">Loading suppliers...</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No suppliers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 hidden sm:table-cell">
                      {supplier.contact_person || '-'}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {supplier.phone || '-'}
                    </td>
                    <td className="px-3 py-3">
                      <Badge status={supplier.is_active ? 'active' : 'inactive'}>
                        {supplier.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-0.5">
                        <IconButton
                          icon={Edit}
                          onClick={() => {
                            setSupplierForm({
                              name: supplier.name || '',
                              contactPerson: supplier.contact_person || '',
                              phone: supplier.phone || '',
                              email: supplier.email || '',
                              address: supplier.address || '',
                              licenseNumber: supplier.license_number || '',
                              rating: supplier.rating || 0,
                              notes: supplier.notes || '',
                            });
                            openModal('supplierForm', { isEdit: true, data: supplier });
                          }}
                          tooltip="Edit"
                          variant="warning"
                          size="sm"
                        />
                        <IconButton
                          icon={Trash2}
                          onClick={() => {
                            setModals(prev => ({
                              ...prev,
                              confirm: {
                                isOpen: true,
                                title: 'Delete Supplier',
                                message: `Are you sure you want to delete "${supplier.name}"? This action cannot be undone.`,
                                onConfirm: async () => {
                                  try {
                                    await apiRequest(`/api/v1/pharmacy/suppliers/${supplier.id}/`, { method: 'DELETE' });
                                    dispatch(fetchSuppliers());
                                    setSuccessMessage('Supplier deleted successfully.');
                                    setTimeout(() => setSuccessMessage(''), 3000);
                                    closeModal('confirm');
                                  } catch (err) {
                                    setErrorMessage(err.message || 'Failed to delete supplier');
                                  }
                                }
                              }
                            }));
                          }}
                          tooltip="Delete"
                          variant="danger"
                          size="sm"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pharmacy Management</h1>
                <p className="text-sm text-gray-500">NEML • NAFDAC & PCN Compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={handleRefresh} variant="secondary" size="sm" icon={RefreshCw} className={loading ? 'animate-spin' : ''}>
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button onClick={() => {}} variant="secondary" size="sm" icon={BarChart3}>
                <span className="hidden sm:inline">Reports</span>
              </Button>
              <Button onClick={() => {
                setDrugForm(getDefaultDrugForm());
                openModal('drugForm', { isEdit: false, data: null });
              }} variant="primary" size="sm" icon={Plus}>
                <span className="hidden sm:inline">Add Drug</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMessage}
            </span>
            <button onClick={() => setErrorMessage('')} className="text-rose-700 hover:text-rose-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {successMessage}
            </span>
            <button onClick={() => setSuccessMessage('')} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
          <StatsCard title="Total Drugs" value={stats.totalDrugs} icon={Package} color="green" />
          <StatsCard title="Inventory Value" value={stats.totalValue} icon={DollarSign} color="gold" />
          <StatsCard title="Low Stock" value={stats.lowStockCount} icon={AlertTriangle} color="warm" />
          <StatsCard title="Expired" value={stats.expiredCount} icon={XCircle} color="red" />
          <StatsCard title="Controlled" value={stats.controlledCount} icon={Shield} color="purple" />
          <StatsCard title="Active" value={stats.activeCount} icon={CheckCircle} color="teal" />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4 overflow-x-auto">
          <nav className="flex gap-6 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Toolbar */}
          {activeTab === 'inventory' && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative flex-1 max-w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search drugs..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      dispatch(searchDrugs(e.target.value));
                    }}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none pl-8 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all cursor-pointer bg-white"
                    >
                      {statusFilterOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <IconButton icon={Printer} onClick={() => window.print()} tooltip="Print" size="sm" />
                  <IconButton icon={Download} onClick={handleExportReport} tooltip="Export" size="sm" />
                  <Button onClick={() => {
                    setDrugForm(getDefaultDrugForm());
                    openModal('drugForm', { isEdit: false, data: null });
                  }} variant="primary" size="sm" icon={Plus}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'inventory' && renderInventoryContent()}
          {activeTab === 'prescriptions' && renderPrescriptionsContent()}
          {activeTab === 'sales' && renderSalesContent()}
          {activeTab === 'suppliers' && renderSuppliersContent()}
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      <DrugFormModal
        isOpen={modals.drugForm.isOpen}
        onClose={() => closeModal('drugForm')}
        onSubmit={handleDrugFormSubmit}
        initialData={modals.drugForm.data}
        loading={loading}
        isEdit={modals.drugForm.isEdit}
      />

      <SupplierFormModal
        isOpen={modals.supplierForm.isOpen}
        onClose={() => closeModal('supplierForm')}
        onSubmit={handleSupplierSubmit}
        initialData={modals.supplierForm.data}
        loading={loading}
        isEdit={modals.supplierForm.isEdit}
      />

      <RestockModal
        isOpen={modals.restock.isOpen}
        onClose={() => closeModal('restock')}
        onSubmit={handleRestockSubmit}
        loading={loading}
      />

      <CartModal
        isOpen={modals.cart.isOpen}
        onClose={() => closeModal('cart')}
        items={cart || []}
        onRemove={(index) => dispatch(removeFromCart(index))}
        onCheckout={handleProcessSale}
        loading={loading}
      />

      <PrescriptionPatientModal
        patient={modals.prescriptions.patient}
        onClose={() => closeModal('prescriptions')}
        onDispense={handleDispensePrescription}
        drugs={drugs}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modals.confirm.isOpen}
        onClose={() => closeModal('confirm')}
        onConfirm={modals.confirm.onConfirm}
        type="delete"
        title={modals.confirm.title}
        message={modals.confirm.message}
        confirmText="Confirm"
      />
    </div>
  );
};

export default Pharmacy;