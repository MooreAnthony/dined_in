import { useState, useEffect } from 'react';
import {
  fetchCompanyUsers,
  fetchCompanyRoles,
  inviteUser as inviteUserService,
} from '../services/supabase/users';
import type { CompanyUser } from '../types/users';
import type { Role } from '../types/roles';
import type { InviteUserData } from '../types/users';

export function useCompanyUsers(companyId: string | undefined) {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!companyId) return;

      setIsLoading(true);
      setError(null);

      try {
        const [usersData, rolesData] = await Promise.all([
          fetchCompanyUsers(companyId),
          fetchCompanyRoles(companyId),
        ]);
        
        setUsers(usersData);
        setRoles(rolesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
        console.error('Error loading users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [companyId]);

  const inviteUser = async (data: InviteUserData) => {
    if (!companyId) throw new Error('No company selected');

      await inviteUserService(companyId, data);
      // Optionally update the users list or show a success message
  };

  return {
    users,
    roles,
    isLoading,
    error,
    inviteUser,
  };
}