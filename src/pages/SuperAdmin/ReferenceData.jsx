import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, X, Loader2, AlertCircle, CheckCircle,
  Globe, MapPin, Building2
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';
import { useSuperAdminData } from '../../contexts/SuperAdminDataContext';

const TABS = [
  { key: 'countries', label: 'Countries', icon: Globe },
  { key: 'states', label: 'States', icon: MapPin },
  { key: 'lgas', label: 'LGAs', icon: MapPin },
  { key: 'facility_types', label: 'Facility Types', icon: Building2 },
];

const inputClass = "w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded";

const ReferenceData = () => {
  const { countries, states, lgas, facilityTypes, loading, error, refresh } = useSuperAdminData();
  const [activeTab, setActiveTab] = useState('countries');
  const [success, setSuccess] = useState('');
  const [modalError, setModalError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

  // Focus the name input when modal opens
  useEffect(() => {
    if (showModal && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 150);
    }
  }, [showModal]);

  const openCreate = (type) => {
    setModalType(type);
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const openEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const apiMap = {
        countries: superAdminApi.deleteCountry,
        states: superAdminApi.deleteState,
        lgas: superAdminApi.deleteLga,
        facility_types: superAdminApi.deleteFacilityType,
      };
      await apiMap[type](id);
      setSuccess('Deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      refresh();
    } catch (err) {
      setModalError(err.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError('');
    try {
      const apiMap = {
        countries: editingItem ? superAdminApi.updateCountry : superAdminApi.createCountry,
        states: editingItem ? superAdminApi.updateState : superAdminApi.createState,
        lgas: editingItem ? superAdminApi.updateLga : superAdminApi.createLga,
        facility_types: editingItem ? superAdminApi.updateFacilityType : superAdminApi.createFacilityType,
      };
      const api = apiMap[modalType];
      if (editingItem) {
        await api(editingItem.id, formData);
      } else {
        await api(formData);
      }
      setSuccess(editingItem ? 'Updated successfully' : 'Created successfully');
      setTimeout(() => setSuccess(''), 3000);
      setShowModal(false);
      setModalError('');
      refresh();
    } catch (err) {
      setModalError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const renderCountryForm = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Name *</label>
        <input 
          ref={nameInputRef}
          type="text"
          required 
          value={formData.name || ''} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          className={inputClass}
          placeholder="Enter country name"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Code</label>
        <input 
          type="text"
          value={formData.code || ''} 
          onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
          className={inputClass} 
          placeholder="e.g. NG, US"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Phone Code</label>
        <input 
          type="text"
          value={formData.phone_code || ''} 
          onChange={(e) => setFormData({ ...formData, phone_code: e.target.value })} 
          className={inputClass} 
          placeholder="+234"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
        <input 
          type="text"
          value={formData.currency || ''} 
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })} 
          className={inputClass} 
          placeholder="NGN"
          autoComplete="off"
        />
      </div>
    </div>
  );

  const renderStateForm = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Name *</label>
        <input 
          ref={nameInputRef}
          type="text"
          required 
          value={formData.name || ''} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          className={inputClass}
          placeholder="Enter state name"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Country *</label>
        <select 
          required 
          value={formData.country || ''} 
          onChange={(e) => setFormData({ ...formData, country: e.target.value })} 
          className={inputClass}
        >
          <option value="">Select country</option>
          {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Code</label>
        <input 
          type="text"
          value={formData.code || ''} 
          onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
          className={inputClass}
          placeholder="Enter state code"
          autoComplete="off"
        />
      </div>
    </div>
  );

  const renderLgaForm = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Name *</label>
        <input 
          ref={nameInputRef}
          type="text"
          required 
          value={formData.name || ''} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          className={inputClass}
          placeholder="Enter LGA name"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">State *</label>
        <select 
          required 
          value={formData.state || ''} 
          onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
          className={inputClass}
        >
          <option value="">Select state</option>
          {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
    </div>
  );

  const renderFacilityTypeForm = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Name *</label>
        <input 
          ref={nameInputRef}
          type="text"
          required 
          value={formData.name || ''} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          className={inputClass}
          placeholder="Enter facility type name"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Code</label>
        <input 
          type="text"
          value={formData.code || ''} 
          onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
          className={inputClass}
          placeholder="Enter facility type code"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
        <textarea 
          value={formData.description || ''} 
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          rows="3" 
          className={inputClass}
          placeholder="Enter description"
        />
      </div>
    </div>
  );

  const renderForm = () => {
    switch (modalType) {
      case 'countries': return renderCountryForm();
      case 'states': return renderStateForm();
      case 'lgas': return renderLgaForm();
      case 'facility_types': return renderFacilityTypeForm();
      default: return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">Reference Data</h2>
          <p className="text-sm text-[#5A5A5A]">Manage countries, states, LGAs, and facility types</p>
        </div>
        <button
          onClick={() => openCreate(activeTab.slice(0, -1))}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008751] px-4 py-2 text-sm font-medium text-white hover:bg-[#006B40] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New {activeTab.slice(0, -1).replace('_', ' ')}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 text-sm text-[#C8553D] flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-[#D0E3D8] bg-[#EAF3EE] p-4 text-sm text-[#2D7D46] flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        <div className="flex border-b border-[#E8E3DC] bg-[#F7F5F2]">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-[#008751] text-[#008751] bg-white'
                  : 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#C79A3D]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E3DC]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3DC]">
                  {activeTab === 'countries' && countries.map(item => (
                    <tr key={item.id} className="hover:bg-[#F7F5F2]">
                      <td className="px-4 py-3 text-sm text-[#1A1A1A]">{item.name}</td>
                      <td className="px-4 py-3 text-xs text-[#5A5A5A]">{item.code || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEdit('countries', item)} 
                            className="p-1.5 rounded text-[#5A5A5A] hover:text-[#008751] hover:bg-[#E8F5EF] transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete('countries', item.id)} 
                            className="p-1.5 rounded text-[#5A5A5A] hover:text-[#C8553D] hover:bg-[#F5EDEA] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'states' && states.map(item => (
                    <tr key={item.id} className="hover:bg-[#F7F5F2]">
                      <td className="px-4 py-3 text-sm text-[#1A1A1A]">{item.name}</td>
                      <td className="px-4 py-3 text-xs text-[#5A5A5A]">{item.code || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEdit('states', item)} 
                            className="p-1.5 rounded text-[#5A5A5A] hover:text-[#008751] hover:bg-[#E8F5EF] transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete('states', item.id)} 
                            className="p-1.5 rounded text-[#5A5A5A] hover:text-[#C8553D] hover:bg-[#F5EDEA] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'lgas' && lgas.map(item => (
                    <tr key={item.id} className="hover:bg-[#F7F5F2]">
                      <td className="px-4 py-3 text-sm text-[#1A1A1A]">{item.name}</td>
                      <td className="px-4 py-3 text-xs text-[#5A5A5A]">{item.state_name || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEdit('lgas', item)} 
                            className="p-1.5 rounded text-[#5A5A5A] hover:text-[#008751] hover:bg-[#E8F5EF] transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete('lgas', item.id)} 
                            className="p-1.5 rounded text-[#5A5A5A] hover:text-[#C8553D] hover:bg-[#F5EDEA] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'facility_types' && facilityTypes.map(item => (
                    <tr key={item.id} className="hover:bg-[#F7F5F2]">
                      <td className="px-4 py-3 text-sm text-[#1A1A1A]">{item.name}</td>
                      <td className="px-4 py-3 text-xs text-[#5A5A5A]">{item.code || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEdit('facility_types', item)} 
                            className="p-1.5 rounded text-[#5A5A5A] hover:text-[#008751] hover:bg-[#E8F5EF] transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete('facility_types', item.id)} 
                            className="p-1.5 rounded text-[#5A5A5A] hover:text-[#C8553D] hover:bg-[#F5EDEA] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A1917]/60 backdrop-blur-sm transition-opacity pointer-events-none"
            onClick={() => setShowModal(false)}
          />
          {/* Modal */}
          <div
            ref={modalRef}
            className="relative bg-[#F7F5F2] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl pointer-events-auto"
            style={{ zIndex: 10000 }}
          >
            <div className="sticky top-0 bg-[#F7F5F2] border-b border-[#E8E3DC] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-display font-semibold text-[#1A1A1A]">
                {editingItem ? 'Edit' : 'Create'} {modalType.replace('_', ' ')}
              </h3>
              <button 
                type="button"
                onClick={() => setShowModal(false)} 
                className="p-1.5 rounded hover:bg-[#E8E3DC] transition-colors"
              >
                <X className="w-5 h-5 text-[#5A5A5A]" />
              </button>
            </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
               {modalError && (
                 <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-3 text-sm text-[#C8553D]">
                   {modalError}
                 </div>
               )}
              {renderForm()}
              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E3DC]">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 text-sm font-medium text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-4 py-2 text-sm font-medium bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceData;