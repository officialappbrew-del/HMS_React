import { apiRequest } from './api';

export const superAdminApi = {
  getAnalytics: () => apiRequest('/api/v1/superadmin/analytics/'),

  getTenantAnalytics: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/superadmin/tenant-analytics/${qsStr ? '?' + qsStr : ''}`);
  },

  getSubscriptionAnalytics: () => apiRequest('/api/v1/superadmin/subscriptions/'),

  getTenants: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/superadmin/tenants/${qsStr ? '?' + qsStr : ''}`);
  },

  createTenant: (data) => apiRequest('/api/v1/superadmin/tenants/create/', { method: 'POST', body: JSON.stringify(data) }),

getTenant: (publicId) => apiRequest(`/api/v1/superadmin/tenants/${publicId}/`),

  updateTenant: (publicId, data) =>
    apiRequest(`/api/v1/superadmin/tenants/${publicId}/`, { method: 'PATCH', body: JSON.stringify(data) }),

  toggleTenant: (publicId, action = 'toggle') =>
    apiRequest(`/api/v1/superadmin/tenants/${publicId}/toggle/`, { method: 'POST', body: JSON.stringify({ action }) }),

  deleteTenant: (publicId, confirmationName) =>
    apiRequest(`/api/v1/superadmin/tenants/${publicId}/delete/`, { method: 'DELETE', body: JSON.stringify({ confirmation_name: confirmationName }) }),

  getUsers: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/superadmin/users/${qsStr ? '?' + qsStr : ''}`);
  },

  toggleUser: (tenantId, userId) =>
    apiRequest(`/api/v1/superadmin/users/tenant/${tenantId}/${userId}/toggle/`, { method: 'POST' }),

  getPatients: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/superadmin/patients/${qsStr ? '?' + qsStr : ''}`);
  },

  getAuditLogs: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/superadmin/audit-logs/${qsStr ? '?' + qsStr : ''}`);
  },

  getSettings: () => apiRequest('/api/v1/superadmin/settings/'),

  updateSettings: (data) => apiRequest('/api/v1/superadmin/settings/', { method: 'PUT', body: JSON.stringify(data) }),

  getSubscriptionPlans: () => apiRequest('/api/v1/tenants/subscription-plans/'),

  createSubscriptionPlan: (data) => apiRequest('/api/v1/tenants/subscription-plans/', { method: 'POST', body: JSON.stringify(data) }),

  updateSubscriptionPlan: (id, data) => apiRequest(`/api/v1/tenants/subscription-plans/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteSubscriptionPlan: (id) => apiRequest(`/api/v1/tenants/subscription-plans/${id}/`, { method: 'DELETE' }),

  setDefaultPlan: (id) => apiRequest(`/api/v1/tenants/subscription-plans/${id}/set_default/`, { method: 'POST' }),

  getReferenceData: () => apiRequest('/api/v1/core/reference-data/'),

  getCountries: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/core/countries/${qsStr ? '?' + qsStr : ''}`);
  },

  createCountry: (data) => apiRequest('/api/v1/core/countries/', { method: 'POST', body: JSON.stringify(data) }),

  updateCountry: (id, data) => apiRequest(`/api/v1/core/countries/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteCountry: (id) => apiRequest(`/api/v1/core/countries/${id}/`, { method: 'DELETE' }),

  getStates: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/core/states/${qsStr ? '?' + qsStr : ''}`);
  },

  createState: (data) => apiRequest('/api/v1/core/states/', { method: 'POST', body: JSON.stringify(data) }),

  updateState: (id, data) => apiRequest(`/api/v1/core/states/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteState: (id) => apiRequest(`/api/v1/core/states/${id}/`, { method: 'DELETE' }),

  getLgas: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/core/lgas/${qsStr ? '?' + qsStr : ''}`);
  },

  createLga: (data) => apiRequest('/api/v1/core/lgas/', { method: 'POST', body: JSON.stringify(data) }),

  updateLga: (id, data) => apiRequest(`/api/v1/core/lgas/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteLga: (id) => apiRequest(`/api/v1/core/lgas/${id}/`, { method: 'DELETE' }),

  getFacilityTypes: () => apiRequest('/api/v1/core/facility-types/'),

  createFacilityType: (data) => apiRequest('/api/v1/core/facility-types/', { method: 'POST', body: JSON.stringify(data) }),

  updateFacilityType: (id, data) => apiRequest(`/api/v1/core/facility-types/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteFacilityType: (id) => apiRequest(`/api/v1/core/facility-types/${id}/`, { method: 'DELETE' }),

  getSupportTickets: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/superadmin/support-tickets/${qsStr ? '?' + qsStr : ''}`);
  },

  getSupportTicket: (ticketId) => apiRequest(`/api/v1/superadmin/support-tickets/${ticketId}/`),

  updateSupportTicket: (ticketId, data) => apiRequest(`/api/v1/superadmin/support-tickets/${ticketId}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteSupportTicket: (ticketId) => apiRequest(`/api/v1/superadmin/support-tickets/${ticketId}/`, { method: 'DELETE' }),

  getGlobalAdmins: () => apiRequest('/api/v1/superadmin/global-admins/'),

  createGlobalAdmin: (data) => apiRequest('/api/v1/superadmin/global-admins/', { method: 'POST', body: JSON.stringify(data) }),

  getGlobalAdmin: (adminId) => apiRequest(`/api/v1/superadmin/global-admins/${adminId}/`),

  updateGlobalAdmin: (adminId, data) => apiRequest(`/api/v1/superadmin/global-admins/${adminId}/`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteGlobalAdmin: (adminId) => apiRequest(`/api/v1/superadmin/global-admins/${adminId}/`, { method: 'DELETE' }),

  getTenantSubscription: (publicId) => apiRequest(`/api/v1/superadmin/tenants/${publicId}/subscription/`),

  upgradeTenantSubscription: (publicId, data) =>
    apiRequest(`/api/v1/superadmin/tenants/${publicId}/subscription/upgrade/`, { method: 'POST', body: JSON.stringify(data) }),

  checkoutSubscription: (data) =>
    apiRequest('/api/v1/billing/checkout/', { method: 'POST', body: JSON.stringify(data) }),
};

export default superAdminApi;
