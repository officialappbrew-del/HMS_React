const isLocalFrontend = () => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname);
};

const isLocalApiUrl = (url = '') =>
  /^(http|https):\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)(:|\/|$)/.test(url);

const API_BASE_URL = (() => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (isLocalFrontend()) {
    return configuredUrl || 'http://localhost:8000';
  }

  if (configuredUrl && !isLocalApiUrl(configuredUrl)) {
    return configuredUrl;
  }
  
  // return 'http://localhost:8000';

  return 'https://hms-backend-l09g.onrender.com';
})();

const PUBLIC_AUTH_PATHS = [
  '/api/v1/auth/login/',
  '/api/v1/auth/token/refresh/',
  '/api/v1/auth/verify-2fa/',
  '/api/v1/auth/two-factor/setup/',
  '/api/v1/auth/two-factor/backup-codes/',
  '/api/v1/tenants/active-tenants/',
  '/api/v1/tenants/invitations/accept/',
];

let isRefreshing = false;
let refreshPromise = null;

const shouldSkipAuthHeader = (requestPath) =>
  PUBLIC_AUTH_PATHS.some((publicPath) => requestPath === publicPath || requestPath.startsWith(publicPath));

const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tenantId');
  localStorage.removeItem('tenantDomain');
  localStorage.removeItem('tenantName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  window.dispatchEvent(new Event('authChanged'));
};

const isTokenErrorMessage = (message = '') =>
  /token expired|expired token|invalid token|authentication failed|unauthorized|not authenticated|signature has expired|invalid signature/i.test(message);

const refreshAccessToken = async () => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available.');
  }

  isRefreshing = true;
  refreshPromise = fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })
    .then(async (response) => {
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json().catch(() => ({})) : await response.text();

      if (!response.ok) {
        const message =
          (data && (data.detail || data.error || data.message || data.non_field_errors?.[0])) ||
          `Refresh failed with status ${response.status}`;
        throw new Error(message);
      }

      const newAccessToken = data.access || data.access_token || data.token;
      const newRefreshToken = data.refresh || data.refresh_token;

      if (!newAccessToken) {
        throw new Error('No access token returned from refresh endpoint.');
      }

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('authToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      return newAccessToken;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

export const apiRequest = async (path, options = {}) => {
  const makeRequest = async () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');

    const headers = {
      'Content-Type': 'application/json',
      ...(token && !shouldSkipAuthHeader(path) ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body ? options.body : undefined,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json().catch(() => ({})) : await response.text();

    if (!response.ok) {
      const message =
        (data && (data.detail || data.error || data.message || data.non_field_errors?.[0])) ||
        `Request failed with status ${response.status}`;

      const shouldAttemptRefresh =
        !shouldSkipAuthHeader(path) &&
        isTokenErrorMessage(message) &&
        (response.status === 401 || response.status === 403);

      if (shouldAttemptRefresh) {
        try {
          await refreshAccessToken();
          return apiRequest(path, options);
        } catch (refreshError) {
          clearAuthData();
          throw new Error(refreshError.message || 'Session expired. Please log in again.');
        }
      }

      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  };

  return makeRequest();
};

export const parseListResponse = (data) => {
  if (Array.isArray(data)) return data;
  return data?.results || data || [];
};

export { API_BASE_URL };
export default API_BASE_URL;

export const pharmacyApi = {
  getDrugs: async (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/pharmacy/drugs/${qsStr ? '?' + qsStr : ''}`);
  },
  getDrug: (id) => apiRequest(`/api/v1/pharmacy/drugs/${id}/`),
  createDrug: (data) => apiRequest('/api/v1/pharmacy/drugs/', { method: 'POST', body: JSON.stringify(data) }),
  updateDrug: (id, data) => apiRequest(`/api/v1/pharmacy/drugs/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteDrug: (id) => apiRequest(`/api/v1/pharmacy/drugs/${id}/`, { method: 'DELETE' }),
  getReorderAlerts: () => apiRequest('/api/v1/pharmacy/drugs/reorder_alerts/'),
  reorderDrug: (id) => apiRequest(`/api/v1/pharmacy/drugs/${id}/reorder/`, { method: 'POST' }),
  restockDrug: (id, data) => apiRequest(`/api/v1/pharmacy/drugs/${id}/restock/`, { method: 'POST', body: JSON.stringify(data) }),
  getDispenses: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/pharmacy/dispenses/${qsStr ? '?' + qsStr : ''}`);
  },
  createDispense: (data) => apiRequest('/api/v1/pharmacy/dispenses/', { method: 'POST', body: JSON.stringify(data) }),
  getPrescriptions: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/clinical/prescriptions/${qsStr ? '?' + qsStr : ''}`);
  },
  getSuppliers: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/pharmacy/suppliers/${qsStr ? '?' + qsStr : ''}`);
  },
  createSupplier: (data) => apiRequest('/api/v1/pharmacy/suppliers/', { method: 'POST', body: JSON.stringify(data) }),
  updateSupplier: (id, data) => apiRequest(`/api/v1/pharmacy/suppliers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteSupplier: (id) => apiRequest(`/api/v1/pharmacy/suppliers/${id}/`, { method: 'DELETE' }),
  getSales: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/pharmacy/sales/${qsStr ? '?' + qsStr : ''}`);
  },
  createSale: (data) => apiRequest('/api/v1/pharmacy/sales/', { method: 'POST', body: JSON.stringify(data) }),
  getTenant: () => apiRequest('/api/v1/tenants/active-tenants/'),
};

export const consultationApi = {
  getVisit: (visitId) => apiRequest(`/api/v1/patients/visits/${visitId}/`),
  getVisits: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/patients/visits/${qsStr ? '?' + qsStr : ''}`);
  },
  getPatientVisits: (patientId, params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/patients/patients/${patientId}/visits/${qsStr ? '?' + qsStr : ''}`);
  },
  checkIn: (patientId, data) => apiRequest(`/api/v1/patients/patients/${patientId}/check_in/`, { method: 'POST', body: JSON.stringify(data) }),
  endConsultation: (visitId, data) => apiRequest(`/api/v1/patients/visits/${visitId}/end_consultation/`, { method: 'POST', body: JSON.stringify(data) }),
  getConsultationNote: (noteId) => apiRequest(`/api/v1/clinical/consultation-notes/${noteId}/`),
  getConsultationNotes: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/clinical/consultation-notes/${qsStr ? '?' + qsStr : ''}`);
  },
  createConsultationNote: (data) => apiRequest('/api/v1/clinical/consultation-notes/', { method: 'POST', body: JSON.stringify(data) }),
  updateConsultationNote: (noteId, data) => apiRequest(`/api/v1/clinical/consultation-notes/${noteId}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  getPrescriptions: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/clinical/prescriptions/${qsStr ? '?' + qsStr : ''}`);
  },
  createPrescription: (data) => apiRequest('/api/v1/clinical/prescriptions/', { method: 'POST', body: JSON.stringify(data) }),
  updatePrescription: (id, data) => apiRequest(`/api/v1/clinical/prescriptions/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deletePrescription: (id) => apiRequest(`/api/v1/clinical/prescriptions/${id}/`, { method: 'DELETE' }),
  getLabOrders: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/laboratory/orders/${qsStr ? '?' + qsStr : ''}`);
  },
  createLabOrder: (data) => apiRequest('/api/v1/laboratory/orders/', { method: 'POST', body: JSON.stringify(data) }),
  getRadiologyOrders: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/radiology/orders/${qsStr ? '?' + qsStr : ''}`);
  },
  createRadiologyOrder: (data) => apiRequest('/api/v1/radiology/orders/', { method: 'POST', body: JSON.stringify(data) }),
  getProcedures: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/procedures/${qsStr ? '?' + qsStr : ''}`);
  },
  createProcedure: (data) => apiRequest('/api/v1/procedures/', { method: 'POST', body: JSON.stringify(data) }),
  getReferrals: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/referrals/${qsStr ? '?' + qsStr : ''}`);
  },
  createReferral: (data) => apiRequest('/api/v1/referrals/', { method: 'POST', body: JSON.stringify(data) }),
  getICD10Codes: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/clinical/icd10-codes/${qsStr ? '?' + qsStr : ''}`);
  },
  searchICD10: (query) => apiRequest(`/api/v1/clinical/icd10-codes/?search=${encodeURIComponent(query)}`),
  getBillingItems: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/billing/items/${qsStr ? '?' + qsStr : ''}`);
  },
  createBillingItem: (data) => apiRequest('/api/v1/billing/items/', { method: 'POST', body: JSON.stringify(data) }),
};
