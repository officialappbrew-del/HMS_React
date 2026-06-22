import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [auth, setAuth] = useState({
    user: null,
    tenant: null,
    tokens: null,
    loading: true,
  });

  useEffect(() => {
    const storedUser = {
      id: localStorage.getItem('userId'),
      user_id: localStorage.getItem('userId'),
      username: localStorage.getItem('userName'),
      first_name: localStorage.getItem('userFirstName'),
      last_name: localStorage.getItem('userLastName'),
      email: localStorage.getItem('userEmail'),
      role: localStorage.getItem('userRole'),
      is_active: true,
    };
    const storedTenant = {
      public_id: localStorage.getItem('tenantId'),
      name: localStorage.getItem('tenantName'),
      domain: localStorage.getItem('tenantDomain'),
    };
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    setAuth({
      user: storedUser.username || storedUser.email ? storedUser : null,
      tenant: storedTenant.name ? storedTenant : null,
      tokens: accessToken ? { access_token: accessToken, refresh_token: refreshToken } : null,
      loading: false,
    });
  }, []);

  return auth;
};

export default useAuth;
