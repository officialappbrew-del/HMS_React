import { useState, useEffect } from 'react';

const PERMISSION_KEYS = {
  canCreateTenants: 'canCreateTenants',
  canSuspendTenants: 'canSuspendTenants',
  canDeleteTenants: 'canDeleteTenants',
  canViewAllTenants: 'canViewAllTenants',
  canManageAdminPermissions: 'canManageAdminPermissions',
};

export const getAdminPermissions = () => ({
  canCreateTenants: localStorage.getItem(PERMISSION_KEYS.canCreateTenants) === 'true',
  canSuspendTenants: localStorage.getItem(PERMISSION_KEYS.canSuspendTenants) === 'true',
  canDeleteTenants: localStorage.getItem(PERMISSION_KEYS.canDeleteTenants) === 'true',
  canViewAllTenants: localStorage.getItem(PERMISSION_KEYS.canViewAllTenants) === 'true',
  canManageAdminPermissions: localStorage.getItem(PERMISSION_KEYS.canManageAdminPermissions) === 'true',
});

export const useAdminPermissions = () => {
  const [permissions, setPermissions] = useState(getAdminPermissions());

  useEffect(() => {
    const updatePermissions = () => setPermissions(getAdminPermissions());
    window.addEventListener('authChanged', updatePermissions);
    return () => window.removeEventListener('authChanged', updatePermissions);
  }, []);

  return permissions;
};

export const isSuperUser = () => {
  const role = (localStorage.getItem('userRole') || '').toLowerCase();
  const isRootAdmin = localStorage.getItem('userIsRootAdmin') === 'true';
  const isSuperuser = localStorage.getItem('userIsSuperuser') === 'true';
  return role === 'super_admin' || isRootAdmin || isSuperuser;
};
