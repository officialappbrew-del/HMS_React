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
  '/api/v1/tenants/invitations/accept',
  '/api/v1/patients/login/',
  '/api/v1/patients/login',
];

let isRefreshing = false;
let refreshPromise = null;
const inFlightRequests = new Map();
const responseCache = new Map();

const shouldSkipAuthHeader = (requestPath) =>
  PUBLIC_AUTH_PATHS.some((publicPath) => requestPath === publicPath || requestPath.startsWith(publicPath));

const normalizeRequestUrl = (path) => {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path}`;
};

const buildRequestKey = (path, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body instanceof FormData ? '__formdata__' : (typeof options.body === 'string' ? options.body : '');
  return `${method}:${path}:${body}`;
};

const getCachedResponse = (requestKey) => {
  const cached = responseCache.get(requestKey);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > cached.ttl) {
    responseCache.delete(requestKey);
    return null;
  }

  return cached.data;
};

const cacheResponse = (requestKey, data, ttl = 5000) => {
  responseCache.set(requestKey, { data, timestamp: Date.now(), ttl });
};

const redirectToLogin = () => {
  if (typeof window === 'undefined') return;

  const isLoginPage = window.location.pathname === '/login' || window.location.pathname.startsWith('/login');
  if (!isLoginPage) {
    window.location.href = '/login';
  }
};

const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('authToken');
  localStorage.removeItem('patientAccessToken');
  localStorage.removeItem('patientRefreshToken');
  localStorage.removeItem('isPatientAuthenticated');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tenantId');
  localStorage.removeItem('tenantDomain');
  localStorage.removeItem('tenantName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userIsRootAdmin');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userFirstName');
  localStorage.removeItem('userLastName');
  localStorage.removeItem('userFullName');
  localStorage.removeItem('licenseNumber');
  localStorage.removeItem('userId');
  localStorage.removeItem('userProfilePicture');
  localStorage.removeItem('rememberMe');
  window.dispatchEvent(new Event('authChanged'));
};

const extractErrorMessage = (data, fallback = 'Request failed') => {
  if (!data) return fallback;

  if (typeof data === 'string') {
    const message = data.trim();
    return message || fallback;
  }

  if (data instanceof Error) {
    return data.message || fallback;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const message = extractErrorMessage(item, '');
      if (message) return message;
    }
    return fallback;
  }

  if (typeof data !== 'object') return fallback;

  const preferredKeys = ['detail', 'error', 'message'];
  for (const key of preferredKeys) {
    const value = data[key];
    if (value === undefined || value === null || value === '') continue;
    const message = extractErrorMessage(value, '');
    if (message) return message;
  }

  if (Array.isArray(data.non_field_errors)) {
    const message = extractErrorMessage(data.non_field_errors, '');
    if (message) return message;
  }

  for (const [key, value] of Object.entries(data)) {
    if (['detail', 'error', 'message', 'non_field_errors'].includes(key)) continue;
    const message = extractErrorMessage(value, '');
    if (message) return message;
  }

  return fallback;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  } catch {
    // Ignore logout API errors; we still clear the client session.
  } finally {
    clearAuthData();
  }
};

const isTokenErrorMessage = (message = '', status = 0) => {
  const normalized = String(message || '').toLowerCase();

  if (!normalized && status === 403) {
    return true;
  }

  return /token expired|expired token|token is expired|invalid token|authentication failed|unauthorized|not authenticated|signature has expired|invalid signature|session expired|forbidden|permission denied|authentication credentials/i.test(normalized);
};

const refreshAccessToken = async () => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  if (localStorage.getItem('patientAccessToken')) {
    throw new Error('Patient sessions do not use the staff token refresh flow.');
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    clearAuthData();
    throw new Error('Session expired. Please log in again.');
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
        const message = extractErrorMessage(data, `Refresh failed with status ${response.status}`);
        clearAuthData();
        redirectToLogin();
        throw new Error(message || 'Session expired. Please log in again.');
      }

      const newAccessToken = data.access || data.access_token || data.token;
      const newRefreshToken = data.refresh || data.refresh_token;

      if (!newAccessToken) {
        clearAuthData();
        redirectToLogin();
        throw new Error('No access token returned from refresh endpoint.');
      }

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('authToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      return newAccessToken;
    })
    .catch((error) => {
      clearAuthData();
      redirectToLogin();
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

export const apiRequest = async (path, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const retryCount = Number(options.__retry || 0);
  const requestKey = buildRequestKey(path, options);

  if (method === 'GET') {
    const cachedResponse = getCachedResponse(requestKey);
    if (cachedResponse !== null) {
      return cachedResponse;
    }

    const inFlight = inFlightRequests.get(requestKey);
    if (inFlight) {
      return inFlight;
    }
  } else {
    const inFlight = inFlightRequests.get(requestKey);
    if (inFlight) {
      return inFlight;
    }
  }

  const requestPromise = (async () => {
    const makeRequest = async () => {
      const patientToken = localStorage.getItem('patientAccessToken');
      const token = patientToken || localStorage.getItem('accessToken') || localStorage.getItem('authToken');
      const tenantId = localStorage.getItem('tenantId');
      const isPatientSession = Boolean(patientToken);

      const isFormData = options.body instanceof FormData;
      const headers = {
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(token && !shouldSkipAuthHeader(path) ? { Authorization: `Bearer ${token}` } : {}),
        ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}),
        ...(options.headers || {}),
      };

      const requestUrl = normalizeRequestUrl(path);
      const response = await fetch(requestUrl, {
        ...options,
        headers,
        body: options.body ? options.body : undefined,
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json().catch(() => ({})) : await response.text();

      if (!response.ok) {
        const message = extractErrorMessage(data, `Request failed with status ${response.status}`);
        const isAuthFailure = [401, 403].includes(response.status);
        const shouldAttemptRefresh =
          !isPatientSession &&
          !shouldSkipAuthHeader(path) &&
          isAuthFailure &&
          isTokenErrorMessage(message, response.status) &&
          retryCount < 1;

        if (shouldAttemptRefresh) {
          try {
            await refreshAccessToken();
            return apiRequest(path, { ...options, __retry: retryCount + 1 });
          } catch (refreshError) {
            throw new Error(refreshError.message || 'Session expired. Please log in again.');
          }
        }

        if (isAuthFailure && !isPatientSession && !shouldSkipAuthHeader(path) && retryCount >= 1) {
          clearAuthData();
          redirectToLogin();
          throw new Error('Session expired. Please log in again.');
        }

        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      if (method === 'GET') {
        cacheResponse(requestKey, data, options.cacheTtl ?? 5000);
      }

      return data;
    };

    try {
      return await makeRequest();
    } finally {
      inFlightRequests.delete(requestKey);
    }
  })();

  inFlightRequests.set(requestKey, requestPromise);
  return requestPromise;
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

export const tenantSettingsApi = {
  getCurrent: () => apiRequest('/api/v1/tenants/settings/current/'),
  getPendingUsers: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    qs.append('include_pending', 'true');
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/tenants/users/${qsStr ? '?' + qsStr : ''}`);
  },
  createInvitation: (data) => apiRequest('/api/v1/tenants/invitations/', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      frontend_base_url: typeof window !== 'undefined' ? window.location.origin : undefined,
    }),
  }),
  listInvitations: () => apiRequest('/api/v1/tenants/invitations/'),
  archiveInvitation: (id) => apiRequest(`/api/v1/tenants/invitations/${id}/archive/`, { method: 'POST' }),
  unarchiveInvitation: (id) => apiRequest(`/api/v1/tenants/invitations/${id}/unarchive/`, { method: 'POST' }),
  deleteInvitation: (id) => apiRequest(`/api/v1/tenants/invitations/${id}/`, { method: 'DELETE' }),
  approveUser: (id) => apiRequest(`/api/v1/tenants/users/${id}/approve/`, { method: 'POST' }),
  rejectUser: (id) => apiRequest(`/api/v1/tenants/users/${id}/reject/`, { method: 'POST' }),
  acceptInvitation: (data) => apiRequest('/api/v1/tenants/invitations/accept/', { method: 'POST', body: JSON.stringify(data) }),
  updateCurrent: (data) => {
    const hasFile = data?.system_logo instanceof File;
    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === 'system_logo') {
          formData.append('system_logo', value);
          return;
        }
        if (key === 'custom_settings' || key === 'password_policy' || key === 'vitals_units') {
          formData.append(key, JSON.stringify(value));
          return;
        }
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
          return;
        }
        formData.append(key, value);
      });
      return apiRequest('/api/v1/tenants/settings/current/', { method: 'PATCH', body: formData });
    }
    return apiRequest('/api/v1/tenants/settings/current/', { method: 'PATCH', body: JSON.stringify(data) });
  }
};

export const admissionApi = {
  getAdmissions: () => apiRequest('/api/v1/ward-rounds/admissions/'),
  getSummary: () => apiRequest('/api/v1/ward-rounds/admissions/summary/'),
  createRequest: (data) => apiRequest('/api/v1/ward-rounds/admissions/create-request/', { method: 'POST', body: JSON.stringify(data) }),
  approve: (id) => apiRequest(`/api/v1/ward-rounds/admissions/${id}/approve/`, { method: 'POST' }),
  reject: (id, data) => apiRequest(`/api/v1/ward-rounds/admissions/${id}/reject/`, { method: 'POST', body: JSON.stringify(data) }),
  admit: (id, data) => apiRequest(`/api/v1/ward-rounds/admissions/${id}/admit/`, { method: 'POST', body: JSON.stringify(data) }),
  transfer: (id, data) => apiRequest(`/api/v1/ward-rounds/admissions/${id}/transfer/`, { method: 'POST', body: JSON.stringify(data) }),
  discharge: (id, data) => apiRequest(`/api/v1/ward-rounds/admissions/${id}/discharge/`, { method: 'POST', body: JSON.stringify(data) }),
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
  getMedicationHistory: (patientId) => apiRequest(`/api/v1/clinical/prescriptions/history/?patient=${patientId}`),
  checkInteractions: (data) => apiRequest('/api/v1/clinical/prescriptions/interaction-check/', { method: 'POST', body: JSON.stringify(data) }),
  getLabOrders: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/lab/orders/${qsStr ? '?' + qsStr : ''}`);
  },
  createLabOrder: (data) => apiRequest('/api/v1/lab/orders/', { method: 'POST', body: JSON.stringify(data) }),
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
    return apiRequest(`/api/v1/billing/invoices/${qsStr ? '?' + qsStr : ''}`);
  },
  createBillingItem: (data) => apiRequest('/api/v1/billing/invoices/', { method: 'POST', body: JSON.stringify(data) }),
  getInvoices: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/billing/invoices/${qsStr ? '?' + qsStr : ''}`);
  },
  getInvoice: (id) => apiRequest(`/api/v1/billing/invoices/${id}/`),
  createInvoice: (data) => apiRequest('/api/v1/billing/invoices/', { method: 'POST', body: JSON.stringify(data) }),
  updateInvoice: (id, data) => apiRequest(`/api/v1/billing/invoices/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  issueInvoice: (id) => apiRequest(`/api/v1/billing/invoices/${id}/issue/`, { method: 'POST' }),
  cancelInvoice: (id) => apiRequest(`/api/v1/billing/invoices/${id}/cancel/`, { method: 'POST' }),
  getInvoiceSummary: () => apiRequest('/api/v1/billing/invoices/summary/'),
  getPayments: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/billing/payments/${qsStr ? '?' + qsStr : ''}`);
  },
  createPayment: (data) => apiRequest('/api/v1/billing/payments/', { method: 'POST', body: JSON.stringify(data) }),
  getInsuranceClaims: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/billing/insurance-claims/${qsStr ? '?' + qsStr : ''}`);
  },
  createInsuranceClaim: (data) => apiRequest('/api/v1/billing/insurance-claims/', { method: 'POST', body: JSON.stringify(data) }),
  submitInsuranceClaim: (id) => apiRequest(`/api/v1/billing/insurance-claims/${id}/submit/`, { method: 'POST' }),
};

export const vitalsApi = {
  getVitalSigns: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/clinical/vital-signs/${qsStr ? '?' + qsStr : ''}`);
  },
  getVitalSign: (id) => apiRequest(`/api/v1/clinical/vital-signs/${id}/`),
  createVitalSign: (data) => apiRequest('/api/v1/clinical/vital-signs/', { method: 'POST', body: JSON.stringify(data) }),
  updateVitalSign: (id, data) => apiRequest(`/api/v1/clinical/vital-signs/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteVitalSign: (id) => apiRequest(`/api/v1/clinical/vital-signs/${id}/`, { method: 'DELETE' }),
  
  getEarlyWarningScores: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/clinical/early-warning-scores/${qsStr ? '?' + qsStr : ''}`);
  },
  calculateEWS: (data) => apiRequest('/api/v1/clinical/early-warning-scores/calculate/', { method: 'POST', body: JSON.stringify(data) }),
  
  getAlerts: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/clinical/vital-sign-alerts/${qsStr ? '?' + qsStr : ''}`);
  },
  getActiveAlerts: () => apiRequest('/api/v1/clinical/vital-sign-alerts/active/'),
  acknowledgeAlert: (id) => apiRequest(`/api/v1/clinical/vital-sign-alerts/${id}/acknowledge/`, { method: 'POST' }),
  resolveAlert: (id, data) => apiRequest(`/api/v1/clinical/vital-sign-alerts/${id}/resolve/`, { method: 'POST', body: JSON.stringify(data) }),
};

export const emrApi = {
  getMedicalRecords: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/emr/medical-records/${qsStr ? '?' + qsStr : ''}`);
  },
  getMedicalRecord: (id) => apiRequest(`/api/v1/emr/medical-records/${id}/`),
  createMedicalRecord: (data) => apiRequest('/api/v1/emr/medical-records/', { method: 'POST', body: JSON.stringify(data) }),
  updateMedicalRecord: (id, data) => apiRequest(`/api/v1/emr/medical-records/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  signMedicalRecord: (id) => apiRequest(`/api/v1/emr/medical-records/${id}/sign/`, { method: 'POST' }),

  getProgressNotes: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/emr/progress-notes/${qsStr ? '?' + qsStr : ''}`);
  },
  createProgressNote: (data) => apiRequest('/api/v1/emr/progress-notes/', { method: 'POST', body: JSON.stringify(data) }),
  updateProgressNote: (id, data) => apiRequest(`/api/v1/emr/progress-notes/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  signProgressNote: (id) => apiRequest(`/api/v1/emr/progress-notes/${id}/sign/`, { method: 'POST' }),

  getDocuments: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/emr/clinical-documents/${qsStr ? '?' + qsStr : ''}`);
  },
  createDocument: (data, file) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.append(k, v));
    if (file) form.append('file', file);
    return apiRequest('/api/v1/emr/clinical-documents/', { method: 'POST', body: form });
  },

  getProblems: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/emr/problem-list/${qsStr ? '?' + qsStr : ''}`);
  },
  createProblem: (data) => apiRequest('/api/v1/emr/problem-list/', { method: 'POST', body: JSON.stringify(data) }),
  resolveProblem: (id) => apiRequest(`/api/v1/emr/problem-list/${id}/resolve/`, { method: 'POST' }),

  getAllergies: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/emr/allergies/${qsStr ? '?' + qsStr : ''}`);
  },
  createAllergy: (data) => apiRequest('/api/v1/emr/allergies/', { method: 'POST', body: JSON.stringify(data) }),
};

export const cdsApi = {
  getDrugInteractions: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/cds/drug-interactions/${qsStr ? '?' + qsStr : ''}`);
  },
  checkDrugInteractions: (data) => apiRequest('/api/v1/cds/drug-interactions/check/', { method: 'POST', body: JSON.stringify(data) }),
  createDrugInteraction: (data) => apiRequest('/api/v1/cds/drug-interactions/', { method: 'POST', body: JSON.stringify(data) }),

  getAllergyChecks: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/cds/allergy-checks/${qsStr ? '?' + qsStr : ''}`);
  },
  createAllergyCheck: (data) => apiRequest('/api/v1/cds/allergy-checks/', { method: 'POST', body: JSON.stringify(data) }),

  getDosingGuidelines: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/cds/dosing-guidelines/${qsStr ? '?' + qsStr : ''}`);
  },
  createDosingGuideline: (data) => apiRequest('/api/v1/cds/dosing-guidelines/', { method: 'POST', body: JSON.stringify(data) }),

  getClinicalGuidelines: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/cds/clinical-guidelines/${qsStr ? '?' + qsStr : ''}`);
  },
  createClinicalGuideline: (data) => apiRequest('/api/v1/cds/clinical-guidelines/', { method: 'POST', body: JSON.stringify(data) }),

  getRiskAssessments: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/cds/risk-assessments/${qsStr ? '?' + qsStr : ''}`);
  },
  createRiskAssessment: (data) => apiRequest('/api/v1/cds/risk-assessments/', { method: 'POST', body: JSON.stringify(data) }),

  getPatientAlerts: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/cds/patient-alerts/${qsStr ? '?' + qsStr : ''}`);
  },
  createPatientAlert: (data) => apiRequest('/api/v1/cds/patient-alerts/', { method: 'POST', body: JSON.stringify(data) }),
  acknowledgeAlert: (id) => apiRequest(`/api/v1/cds/patient-alerts/${id}/acknowledge/`, { method: 'POST' }),
  dismissAlert: (id) => apiRequest(`/api/v1/cds/patient-alerts/${id}/dismiss/`, { method: 'POST' }),
};

export const auditApi = {
  getAudits: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/audit/audits/${qsStr ? '?' + qsStr : ''}`);
  },
  getAudit: (id) => apiRequest(`/api/v1/audit/audits/${id}/`),
  createAudit: (data) => apiRequest('/api/v1/audit/audits/', { method: 'POST', body: JSON.stringify(data) }),
  updateAudit: (id, data) => apiRequest(`/api/v1/audit/audits/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  completeAudit: (id) => apiRequest(`/api/v1/audit/audits/${id}/complete/`, { method: 'POST' }),
  schedulePeerReview: (id) => apiRequest(`/api/v1/audit/audits/${id}/schedule-peer-review/`, { method: 'POST' }),
  scheduleAudit: (data) => apiRequest('/api/v1/audit/audits/', { method: 'POST', body: JSON.stringify(data) }),
  generateAuditReport: (id) => apiRequest(`/api/v1/audit/audits/${id}/generate-report/`, { method: 'POST' }),

  getQualityIndicators: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/audit/quality-indicators/${qsStr ? '?' + qsStr : ''}`);
  },
  createQualityIndicator: (data) => apiRequest('/api/v1/audit/quality-indicators/', { method: 'POST', body: JSON.stringify(data) }),
  updateQualityIndicator: (id, data) => apiRequest(`/api/v1/audit/quality-indicators/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),

  getPeerReviews: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/audit/peer-reviews/${qsStr ? '?' + qsStr : ''}`);
  },

  getMortalityReviews: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/audit/mortality-reviews/${qsStr ? '?' + qsStr : ''}`);
  },
  createMortalityReview: (data) => apiRequest('/api/v1/audit/mortality-reviews/', { method: 'POST', body: JSON.stringify(data) }),

  getComplianceScores: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/audit/compliance-scores/${qsStr ? '?' + qsStr : ''}`);
  },
  updateComplianceScore: (id, data) => apiRequest(`/api/v1/audit/compliance-scores/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
};

export const emergencyApi = {
  getCalls: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ward-rounds/emergency-calls/${qsStr ? '?' + qsStr : ''}`);
  },
  createCall: (data) => apiRequest('/api/v1/ward-rounds/emergency-calls/', { method: 'POST', body: JSON.stringify(data) }),
  updateCallStatus: (id, data) => apiRequest(`/api/v1/ward-rounds/emergency-calls/${id}/update-status/`, { method: 'POST', body: JSON.stringify(data) }),
  dispatchCall: (id, data) => apiRequest(`/api/v1/ward-rounds/emergency-calls/${id}/dispatch/`, { method: 'POST', body: JSON.stringify(data) }),

  getMissions: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ward-rounds/ambulance-missions/${qsStr ? '?' + qsStr : ''}`);
  },
  createMission: (data) => apiRequest('/api/v1/ward-rounds/ambulance-missions/', { method: 'POST', body: JSON.stringify(data) }),
  updateMissionStatus: (id, data) => apiRequest(`/api/v1/ward-rounds/ambulance-missions/${id}/update-status/`, { method: 'POST', body: JSON.stringify(data) }),

  getReferrals: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ward-rounds/referrals/${qsStr ? '?' + qsStr : ''}`);
  },
  createReferral: (data) => apiRequest('/api/v1/ward-rounds/referrals/', { method: 'POST', body: JSON.stringify(data) }),
  approveReferral: (id, data = {}) => apiRequest(`/api/v1/ward-rounds/referrals/${id}/approve/`, { method: 'POST', body: JSON.stringify(data) }),
  completeReferral: (id, data = {}) => apiRequest(`/api/v1/ward-rounds/referrals/${id}/complete/`, { method: 'POST', body: JSON.stringify(data) }),
};

export const ndprApi = {
  getConsentRecords: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ndpr/consent-records/${qsStr ? '?' + qsStr : ''}`);
  },
  createConsentRecord: (data) => apiRequest('/api/v1/ndpr/consent-records/', { method: 'POST', body: JSON.stringify(data) }),
  updateConsentRecord: (id, data) => apiRequest(`/api/v1/ndpr/consent-records/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  withdrawConsent: (id, data = {}) => apiRequest(`/api/v1/ndpr/consent-records/${id}/withdraw/`, { method: 'POST', body: JSON.stringify(data) }),
  renewConsent: (id, data = {}) => apiRequest(`/api/v1/ndpr/consent-records/${id}/renew/`, { method: 'POST', body: JSON.stringify(data) }),

  getDataRequests: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ndpr/data-requests/${qsStr ? '?' + qsStr : ''}`);
  },
  createDataRequest: (data) => apiRequest('/api/v1/ndpr/data-requests/', { method: 'POST', body: JSON.stringify(data) }),
  approveDataRequest: (id) => apiRequest(`/api/v1/ndpr/data-requests/${id}/approve/`, { method: 'POST' }),
  rejectDataRequest: (id, data = {}) => apiRequest(`/api/v1/ndpr/data-requests/${id}/reject/`, { method: 'POST', body: JSON.stringify(data) }),
  completeDataRequest: (id) => apiRequest(`/api/v1/ndpr/data-requests/${id}/complete/`, { method: 'POST' }),

  getDataBreaches: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ndpr/data-breaches/${qsStr ? '?' + qsStr : ''}`);
  },
  createDataBreach: (data) => apiRequest('/api/v1/ndpr/data-breaches/', { method: 'POST', body: JSON.stringify(data) }),
  updateBreachStatus: (id, status, data = {}) => apiRequest(`/api/v1/ndpr/data-breaches/${id}/${status === 'notify' ? 'notify' : 'update-status'}/`, { method: 'POST', body: JSON.stringify(data) }),

  getAuditLogs: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ndpr/audit-logs/${qsStr ? '?' + qsStr : ''}`);
  },
  createAuditLog: (data) => apiRequest('/api/v1/ndpr/audit-logs/', { method: 'POST', body: JSON.stringify(data) }),

  getComplianceMetrics: () => apiRequest('/api/v1/ndpr/compliance-reports/metrics/'),
  getComplianceReports: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ndpr/compliance-reports/${qsStr ? '?' + qsStr : ''}`);
  },
  generateComplianceReport: (data) => apiRequest('/api/v1/ndpr/compliance-reports/', { method: 'POST', body: JSON.stringify(data) }),
};

export const wardRoundApi = {
  getRounds: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ward-rounds/rounds/${qsStr ? '?' + qsStr : ''}`);
  },
  getRound: (id) => apiRequest(`/api/v1/ward-rounds/rounds/${id}/`),
  createRound: (data) => apiRequest('/api/v1/ward-rounds/rounds/', { method: 'POST', body: JSON.stringify(data) }),
  startRound: (id) => apiRequest(`/api/v1/ward-rounds/rounds/${id}/start/`, { method: 'POST' }),
  completeRound: (id, data) => apiRequest(`/api/v1/ward-rounds/rounds/${id}/complete/`, { method: 'POST', body: JSON.stringify(data) }),
  cancelRound: (id, data) => apiRequest(`/api/v1/ward-rounds/rounds/${id}/cancel/`, { method: 'POST', body: JSON.stringify(data) }),
  addPatientToRound: (roundId, patientId) => apiRequest(`/api/v1/ward-rounds/rounds/${roundId}/add-patient/`, { method: 'POST', body: JSON.stringify({ patientId }) }),
  removePatientFromRound: (roundId, patientId) => apiRequest(`/api/v1/ward-rounds/rounds/${roundId}/remove-patient/`, { method: 'POST', body: JSON.stringify({ patientId }) }),
  addTeamMemberToRound: (roundId, member) => apiRequest(`/api/v1/ward-rounds/rounds/${roundId}/add-team-member/`, { method: 'POST', body: JSON.stringify(member) }),
  recordRoundDocumentation: (roundId, patientId, documentation) => apiRequest(`/api/v1/ward-rounds/rounds/${roundId}/record-documentation/`, { method: 'POST', body: JSON.stringify({ patientId, documentation }) }),

  getWards: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ward-rounds/wards/${qsStr ? '?' + qsStr : ''}`);
  },
createWard: (data) => apiRequest('/api/v1/ward-rounds/wards/', { method: 'POST', body: JSON.stringify(data) }),
  updateWard: (id, data) => apiRequest(`/api/v1/ward-rounds/wards/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteWard: (id) => apiRequest(`/api/v1/ward-rounds/wards/${id}/`, { method: 'DELETE' }),
getWard: (id) => apiRequest(`/api/v1/ward-rounds/wards/${id}/`),
  getBeds: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ward-rounds/beds/${qsStr ? '?' + qsStr : ''}`);
  },
createBed: (data) => apiRequest('/api/v1/ward-rounds/beds/', { method: 'POST', body: JSON.stringify(data) }),
  getBed: (id) => apiRequest(`/api/v1/ward-rounds/beds/${id}/`),
  updateBed: (id, data) => apiRequest(`/api/v1/ward-rounds/beds/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBed: (id) => apiRequest(`/api/v1/ward-rounds/beds/${id}/`, { method: 'DELETE' }),
  reserveBed: (id, patientId) => apiRequest(`/api/v1/ward-rounds/beds/${id}/reserve/`, { method: 'POST', body: JSON.stringify({ patientId }) }),
  occupyBed: (id, patientId) => apiRequest(`/api/v1/ward-rounds/beds/${id}/occupy/`, { method: 'POST', body: JSON.stringify({ patientId }) }),
  releaseBed: (id) => apiRequest(`/api/v1/ward-rounds/beds/${id}/release/`, { method: 'POST' }),
  markBedAvailable: (id) => apiRequest(`/api/v1/ward-rounds/beds/${id}/mark-available/`, { method: 'POST' }),

  getHandovers: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ward-rounds/handovers/${qsStr ? '?' + qsStr : ''}`);
  },
  createHandover: (data) => apiRequest('/api/v1/ward-rounds/handovers/', { method: 'POST', body: JSON.stringify(data) }),
  updateHandover: (id, data) => apiRequest(`/api/v1/ward-rounds/handovers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),

  getGrandRounds: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, v); });
    const qsStr = qs.toString();
    return apiRequest(`/api/v1/ward-rounds/grand-rounds/${qsStr ? '?' + qsStr : ''}`);
  },
  createGrandRound: (data) => apiRequest('/api/v1/ward-rounds/grand-rounds/', { method: 'POST', body: JSON.stringify(data) }),
  addCaseStudyToGrandRound: (grandRoundId, caseStudy) => apiRequest(`/api/v1/ward-rounds/grand-rounds/${grandRoundId}/add-case-study/`, { method: 'POST', body: JSON.stringify(caseStudy) }),
};