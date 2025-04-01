import { useState, useEffect } from 'react';
import {
  fetchRoles,
  fetchRole,
  fetchSystemActions,
  fetchRolePermissions,
  createRole,
  updateRole,
  deleteRole,
} from '../services/supabase/roles';
import type { Role, SystemAction, RolePermission, CreateRoleData, UpdateRoleData } from '../types/roles';

export function useRoles(companyId: string | undefined) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      if (!companyId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRoles(companyId);
        setRoles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load roles');
        console.error('Error loading roles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, [companyId]);

  const handleCreateRole = async (data: CreateRoleData) => {
    if (!companyId) throw new Error('No company selected');

    const newRole = await createRole(companyId, data);
    setRoles(prev => [...prev, newRole]);
  };

  const handleUpdateRole = async (id: string, data: UpdateRoleData) => {
    const updatedRole = await updateRole(id, data);
    setRoles(prev => prev.map(role => 
      role.id === id ? updatedRole : role
    ));
  }

  const handleDeleteRole = async (id: string) => {
    await deleteRole(id);
    setRoles(prev => prev.filter(role => role.id !== id));
  };

  return {
    roles,
    isLoading,
    error,
    createRole: handleCreateRole,
    updateRole: handleUpdateRole,
    deleteRole: handleDeleteRole,
  };
}

export function useRole(id: string | undefined) {
  const [role, setRole] = useState<Role | null>(null);
  const [systemActions, setSystemActions] = useState<SystemAction[]>([]);
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoleData = async () => {
      if (!id) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [roleData, actionsData, permissionsData] = await Promise.all([
          fetchRole(id),
          fetchSystemActions(),
          fetchRolePermissions(id),
        ]);

        setRole(roleData);
        setSystemActions(actionsData);
        setPermissions(permissionsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load role data');
        console.error('Error loading role data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoleData();
  }, [id]);

  return {
    role,
    systemActions,
    permissions,
    isLoading,
    error,
  };
}