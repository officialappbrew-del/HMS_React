import React, { useState, useEffect } from 'react';
import {
  Search, Filter, RefreshCw, Loader2
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';
import AdminPagination from '../../components/AdminPagination';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tenantFilter, setTenantFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const loadPatients = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: pageNum, page_size: pageSize };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (tenantFilter) params.tenant_id = tenantFilter;
      const result = await superAdminApi.getPatients(params);
      const items = parseListResponse(result);
      setPatients(items);
      setTotalCount(result.count || items.length);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients(1);
  }, [search, statusFilter, tenantFilter]);

  const parseListResponse = (data) => {
    if (Array.isArray(data)) return data;
    return data?.results || data?.patients || data || [];
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      inactive: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      deceased: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
      transferred: 'bg-[#F5F0EA] text-[#C87D3D] border-[#E8D6D0]',
    };
    return colors[status] || 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
  };

  const getGenderBadge = (gender) => {
    const colors = {
      male: 'bg-[#E3EEF8] text-[#2563A6] border-[#C5DCF0]',
      female: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
      other: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      unknown: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
    };
    return colors[gender] || 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">Patient Management</h2>
          <p className="text-sm text-[#5A5A5A]">Manage patients across all tenants</p>
        </div>
        <button
          onClick={() => loadPatients(page)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D8D4CD] px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, hospital number, MRN, phone, NHIS..."
            className="w-full rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-8 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="deceased">Deceased</option>
            <option value="transferred">Transferred</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <input
            type="text"
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            placeholder="Tenant ID (public_id)"
            className="w-full sm:w-48 rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 text-sm text-[#C8553D]">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F7F5F2]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Hospital / MRN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#5A5A5A]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#C79A3D]" />
                      Loading patients...
                    </div>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#5A5A5A]">No patients found</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={`${patient.tenant_id}-${patient.id}`} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{patient.full_name}</p>
                        <p className="text-xs text-[#5A5A5A]">{patient.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">
                      <div>{patient.hospital_number}</div>
                      <div>{patient.mrn}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${getGenderBadge(patient.gender)}`}>
                        {patient.gender || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${getStatusBadge(patient.patient_status)}`}>
                        {patient.patient_status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">{patient.tenant_name || '-'}</td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">
                      {patient.registration_date ? new Date(patient.registration_date).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={pageSize}
          onPageChange={(p) => loadPatients(p)}
        />
      </div>
    </div>
  );
};

export default PatientManagement;
