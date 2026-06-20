import { useEffect } from 'react';

/**
 * Custom hook to handle errors within functional components
 * @param {Function} callback - Function to call when error occurs
 * @returns {Function} - Error handler function
 */
export const useErrorHandler = (callback) => {
  const handleError = (error, errorInfo) => {
    console.error('Component Error:', error, errorInfo);
    if (callback) {
      callback(error, errorInfo);
    }
  };

  return handleError;
};

/**
 * Custom hook to validate component mount and data availability
 * Helps prevent errors from undefined or null data
 * @param {Any} data - Data to validate
 * @param {String} message - Optional error message
 * @returns {Boolean} - Whether data is valid
 */
export const useDataValidation = (data, message = 'Data not available') => {
  useEffect(() => {
    if (!data) {
      console.warn(message);
    }
  }, [data, message]);

  return !!data;
};

/**
 * Safe data accessor - prevents errors when accessing nested properties
 * @param {Object} obj - Object to access
 * @param {String} path - Dot-notation path to property
 * @param {Any} defaultValue - Default value if path not found
 * @returns {Any} - Value at path or defaultValue
 */
export const safeGet = (obj, path, defaultValue = null) => {
  try {
    const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
    return value !== undefined ? value : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Try-catch wrapper for async operations
 * @param {Function} asyncFn - Async function to execute
 * @param {Any} fallbackValue - Value to return on error
 * @returns {Promise} - Result of async function or fallbackValue
 */
export const safeTryCatch = async (asyncFn, fallbackValue = null) => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Async operation error:', error);
    return fallbackValue;
  }
};

/**
 * Custom hook to retry failed operations
 * @param {Function} operation - Function to retry
 * @param {Number} maxRetries - Maximum number of retries
 * @param {Number} delay - Delay between retries in ms
 * @returns {Promise} - Result of successful operation or last error
 */
export const useRetry = async (operation, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Validate Redux state before rendering
 * @param {Object} state - Redux state
 * @param {Array} requiredKeys - Keys that must exist in state
 * @returns {Boolean} - Whether all required keys exist
 */
export const validateReduxState = (state, requiredKeys = []) => {
  if (!state) return false;
  return requiredKeys.every(key => key in state);
};

export default {
  useErrorHandler,
  useDataValidation,
  safeGet,
  safeTryCatch,
  useRetry,
  validateReduxState,
};
