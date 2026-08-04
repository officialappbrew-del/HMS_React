import Cookies from 'js-cookie';

// Cookie configuration constants
const COOKIE_OPTIONS = {
  // Authentication cookies - expire in 7 days
  AUTH: {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  },
  // Session cookies - expire when browser closes
  SESSION: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  },
  // Preferences cookies - expire in 30 days
  PREFERENCES: {
    expires: 30,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  },
  // Analytics cookies - expire in 365 days
  ANALYTICS: {
    expires: 365,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
};

// Cookie names
export const COOKIE_NAMES = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  USER_ID: 'user_id',
  USER_ROLE: 'user_role',
  // Session
  SESSION_ID: 'session_id',
  // Preferences
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  REFRESH_INTERVAL: 'refresh_interval',
  // Analytics
  VISITOR_ID: 'visitor_id',
  SESSION_START: 'session_start',
  PAGE_VIEWS: 'page_views',
  LAST_VISIT: 'last_visit',
  // Consent
  COOKIE_CONSENT: 'cookie_consent'
};

/**
 * Set an authentication cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Additional options
 */
export const setAuthCookie = (name, value, options = {}) => {
  Cookies.set(name, value, { ...COOKIE_OPTIONS.AUTH, ...options });
};

/**
 * Set a session cookie (expires when browser closes)
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Additional options
 */
export const setSessionCookie = (name, value, options = {}) => {
  Cookies.set(name, value, { ...COOKIE_OPTIONS.SESSION, ...options });
};

/**
 * Set a preferences cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Additional options
 */
export const setPreferenceCookie = (name, value, options = {}) => {
  Cookies.set(name, value, { ...COOKIE_OPTIONS.PREFERENCES, ...options });
};

/**
 * Set an analytics cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Additional options
 */
export const setAnalyticsCookie = (name, value, options = {}) => {
  Cookies.set(name, value, { ...COOKIE_OPTIONS.ANALYTICS, ...options });
};

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  return Cookies.get(name) || null;
};

/**
 * Remove a cookie
 * @param {string} name - Cookie name
 * @param {Object} options - Additional options
 */
export const removeCookie = (name, options = {}) => {
  Cookies.remove(name, options);
};

/**
 * Check if user is authenticated based on cookies
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const token = getCookie(COOKIE_NAMES.AUTH_TOKEN);
  const userId = getCookie(COOKIE_NAMES.USER_ID);
  return !!(token && userId);
};

/**
 * Get user authentication data from cookies
 * @returns {Object} User auth data
 */
export const getAuthData = () => {
  return {
    token: getCookie(COOKIE_NAMES.AUTH_TOKEN),
    userId: getCookie(COOKIE_NAMES.USER_ID),
    role: getCookie(COOKIE_NAMES.USER_ROLE)
  };
};

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = () => {
  removeCookie(COOKIE_NAMES.AUTH_TOKEN);
  removeCookie(COOKIE_NAMES.USER_ID);
  removeCookie(COOKIE_NAMES.USER_ROLE);
};

/**
 * Get user preferences from cookies
 * @returns {Object} User preferences
 */
export const getUserPreferences = () => {
  return {
    theme: getCookie(COOKIE_NAMES.THEME) || 'light',
    language: getCookie(COOKIE_NAMES.LANGUAGE) || 'en',
    sidebarCollapsed: getCookie(COOKIE_NAMES.SIDEBAR_COLLAPSED) === 'true',
    refreshInterval: parseInt(getCookie(COOKIE_NAMES.REFRESH_INTERVAL) || '300', 10) || 300,
  };
};

/**
 * Set user preferences in cookies
 * @param {Object} preferences - User preferences
 */
export const setUserPreferences = (preferences) => {
  if (preferences.theme) setPreferenceCookie(COOKIE_NAMES.THEME, preferences.theme);
  if (preferences.language) setPreferenceCookie(COOKIE_NAMES.LANGUAGE, preferences.language);
  if (typeof preferences.sidebarCollapsed === 'boolean') {
    setPreferenceCookie(COOKIE_NAMES.SIDEBAR_COLLAPSED, preferences.sidebarCollapsed.toString());
  }
  if (typeof preferences.refreshInterval !== 'undefined') {
    setPreferenceCookie(COOKIE_NAMES.REFRESH_INTERVAL, String(preferences.refreshInterval));
  }
};

/**
 * Initialize analytics tracking
 * Creates visitor ID and session if they don't exist
 */
export const initializeAnalytics = () => {
  let visitorId = getCookie(COOKIE_NAMES.VISITOR_ID);
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setAnalyticsCookie(COOKIE_NAMES.VISITOR_ID, visitorId);
  }

  let sessionId = getCookie(COOKIE_NAMES.SESSION_ID);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionCookie(COOKIE_NAMES.SESSION_ID, sessionId);
    setAnalyticsCookie(COOKIE_NAMES.SESSION_START, new Date().toISOString());
  }

  // Update last visit
  setAnalyticsCookie(COOKIE_NAMES.LAST_VISIT, new Date().toISOString());

  return { visitorId, sessionId };
};

/**
 * Track page view
 * @param {string} page - Page path
 */
export const trackPageView = (page) => {
  const currentViews = parseInt(getCookie(COOKIE_NAMES.PAGE_VIEWS) || '0');
  setAnalyticsCookie(COOKIE_NAMES.PAGE_VIEWS, (currentViews + 1).toString());

  // You can extend this to send data to analytics service
  console.log(`Page view tracked: ${page}, Total views: ${currentViews + 1}`);
};

/**
 * Get analytics data
 * @returns {Object} Analytics data
 */
export const getAnalyticsData = () => {
  return {
    visitorId: getCookie(COOKIE_NAMES.VISITOR_ID),
    sessionId: getCookie(COOKIE_NAMES.SESSION_ID),
    sessionStart: getCookie(COOKIE_NAMES.SESSION_START),
    pageViews: parseInt(getCookie(COOKIE_NAMES.PAGE_VIEWS) || '0'),
    lastVisit: getCookie(COOKIE_NAMES.LAST_VISIT)
  };
};

/**
 * Check if user has consented to cookies
 * @returns {boolean} True if consented
 */
export const hasCookieConsent = () => {
  return getCookie(COOKIE_NAMES.COOKIE_CONSENT) === 'true';
};

/**
 * Set cookie consent
 * @param {boolean} consented - Whether user consented
 */
export const setCookieConsent = (consented) => {
  setPreferenceCookie(COOKIE_NAMES.COOKIE_CONSENT, consented.toString());
};

/**
 * Clear all cookies (for logout or reset)
 */
export const clearAllCookies = () => {
  Object.values(COOKIE_NAMES).forEach(name => {
    removeCookie(name);
  });
};