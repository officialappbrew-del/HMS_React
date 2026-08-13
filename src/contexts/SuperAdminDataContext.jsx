import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiRequest, parseListResponse } from '../utils/api';
import { superAdminApi } from '../utils/superAdminApi';

const SuperAdminDataContext = createContext(null);

const initialState = {
  countries: [],
  states: [],
  lgas: [],
  facilityTypes: [],
  plans: [],
  loading: true,
  error: null,
  lastUpdated: null,
};

export const SuperAdminDataProvider = ({ children }) => {
  const [data, setData] = useState(initialState);

  const prefetchAll = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [countriesData, facilityTypesData, plansData] = await Promise.all([
        apiRequest('/api/v1/core/countries/'),
        apiRequest('/api/v1/core/facility-types/'),
        superAdminApi.getSubscriptionPlans(),
      ]);
      setData({
        countries: parseListResponse(countriesData),
        states: [],
        lgas: [],
        facilityTypes: parseListResponse(facilityTypesData),
        plans: parseListResponse(plansData),
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      setData(prev => ({ ...prev, loading: false, error: err.message || 'Failed to load reference data' }));
    }
  }, []);

  const loadStates = useCallback(async (countryId) => {
    if (!countryId) {
      setData(prev => ({ ...prev, states: [], lgas: [] }));
      return [];
    }
    try {
      const result = await apiRequest(`/api/v1/core/states/?country_id=${countryId}`);
      const states = parseListResponse(result);
      setData(prev => ({ ...prev, states, lgas: [] }));
      return states;
    } catch {
      return [];
    }
  }, []);

  const loadLgas = useCallback(async (stateId) => {
    if (!stateId) {
      setData(prev => ({ ...prev, lgas: [] }));
      return [];
    }
    try {
      const result = await apiRequest(`/api/v1/core/lgas/?state_id=${stateId}`);
      const lgas = parseListResponse(result);
      setData(prev => ({ ...prev, lgas }));
      return lgas;
    } catch {
      return [];
    }
  }, []);

  const invalidate = useCallback(() => {
    setData(prev => ({ ...prev, lastUpdated: null }));
  }, []);

  const refresh = useCallback(async () => {
    await prefetchAll();
  }, [prefetchAll]);

  return (
    <SuperAdminDataContext.Provider value={{ ...data, prefetchAll, loadStates, loadLgas, invalidate, refresh }}>
      {children}
    </SuperAdminDataContext.Provider>
  );
};

export const useSuperAdminData = () => {
  const ctx = useContext(SuperAdminDataContext);
  if (!ctx) throw new Error('useSuperAdminData must be used within SuperAdminDataProvider');
  return ctx;
};
