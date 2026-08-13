/**
 * Subdomain detection utilities for SmartCare HMS.
 *
 * The platform runs on two logical surfaces:
 *   - Tenant application (hospital workspaces) — e.g. `hospital1.example.com`
 *   - Super Admin dashboard — `admin.example.com`
 *
 * These helpers handle both localhost (e.g. `admin.localhost:5173`) and
 * production (e.g. `admin.yourdomain.com`) environments, plus raw IP hosts.
 */

const getHostname = () => {
  if (typeof window === 'undefined') return '';
  return window.location.hostname || '';
};

const isLocalhost = (hostname = getHostname()) => {
  return ['localhost', '127.0.0.1', '0.0.0.0', '::1', 'localhost'].includes(
    hostname.toLowerCase()
  );
};

const isIpAddress = (hostname) => {
  // IPv4
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return true;
  // IPv6 (starts with ':' like ::1)
  if (hostname.startsWith(':')) return true;
  return false;
};

/**
 * Return the current subdomain (excluding the root domain).
 *
 * Examples:
 *   localhost:5173            -> ''
 *   admin.localhost:5173      -> 'admin'
 *   hospital1.localhost:5173  -> 'hospital1'
 *   admin.yourdomain.com      -> 'admin'
 *   hospital1.yourdomain.com  -> 'hospital1'
 *   192.168.1.10:5173         -> ''
 */
export const getSubdomain = () => {
  const hostname = getHostname();
  if (!hostname) return '';
  if (isIpAddress(hostname)) return '';

  const parts = hostname.split('.');
  if (parts.length <= 1) return '';

  const isLocalhostHost = parts[parts.length - 1] === 'localhost';
  if (isLocalhostHost) {
    return parts.slice(0, parts.length - 1).join('.');
  }

  if (parts.length > 2) {
    return parts.slice(0, parts.length - 2).join('.');
  }
  return '';
};

/**
 * Whether the current page is the Super Admin interface (admin subdomain).
 */
export const isAdminSubdomain = () => {
  return getSubdomain().toLowerCase() === 'admin';
};

/**
 * Whether the current page is a tenant subdomain (any non-admin subdomain).
 */
export const isTenantSubdomain = () => {
  const subdomain = getSubdomain();
  return Boolean(subdomain) && subdomain.toLowerCase() !== 'admin';
};

/**
 * Get the tenant identifier from the current subdomain.
 * Returns '' when there is no tenant subdomain.
 */
export const getTenantIdentifier = () => {
  const subdomain = getSubdomain();
  if (!subdomain || subdomain.toLowerCase() === 'admin') return '';
  return subdomain;
};

/**
 * Build a URL for a specific subdomain on the current environment.
 *
 * @param {string} subdomain - e.g. 'admin', 'hospital1'
 * @param {string} [path=''] - optional path, e.g. '/dashboard'
 * @returns {string} full absolute URL
 */
export const buildSubdomainUrl = (subdomain, path = '') => {
  if (typeof window === 'undefined') return subdomain;
  const { protocol, port } = window.location;
  const hostname = getHostname();

  let base;
  if (isLocalhost(hostname) || isIpAddress(hostname)) {
    base = `${protocol}//${subdomain}.localhost${port ? `:${port}` : ''}`;
  } else {
    const parts = hostname.split('.');
    const rootDomain = parts.slice(-2).join('.');
    base = `${protocol}//${subdomain}.${rootDomain}`;
  }

  return `${base}${path}`;
};

/**
 * Build the URL for the Super Admin dashboard on the current environment.
 */
export const buildAdminUrl = (path = '') => buildSubdomainUrl('admin', path);

/**
 * Build a URL for a specific tenant subdomain on the current environment.
 */
export const buildTenantUrl = (tenantSubdomain, path = '') =>
  buildSubdomainUrl(tenantSubdomain, path);

/**
 * Header value to send with API requests so the backend can identify
 * whether a request originated from the admin subdomain.
 */
export const getSubdomainHeaderValue = () => {
  const subdomain = getSubdomain();
  return subdomain || '';
};

/**
 * Whether the current session should be treated as an admin session.
 * Combines subdomain detection with stored auth flags.
 */
export const isAdminSession = () => {
  if (isAdminSubdomain()) return true;
  return (
    localStorage.getItem('userIsRootAdmin') === 'true' ||
    ['super_admin', 'system_admin'].includes(
      (localStorage.getItem('userRole') || '').toLowerCase()
    )
  );
};

export default {
  getSubdomain,
  isAdminSubdomain,
  isTenantSubdomain,
  getTenantIdentifier,
  buildSubdomainUrl,
  buildAdminUrl,
  buildTenantUrl,
  getSubdomainHeaderValue,
  isAdminSession,
  isLocalhost,
};
