import { supabase } from './config';
import type { Role, SystemAction, RolePermission, CreateRoleData, UpdateRoleData } from '../../types/roles';

export async function fetchRoles(companyId: string): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('company_id', companyId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function fetchRole(id: string): Promise<Role> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchSystemActions(): Promise<SystemAction[]> {
  const { data, error } = await supabase
    .from('system_actions')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchRolePermissions(roleId: string): Promise<RolePermission[]> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('*')
    .eq('role_id', roleId);

  if (error) throw error;
  return data;
}

export async function createRole(companyId: string, data: CreateRoleData): Promise<Role> {
  const { data: role, error } = await supabase
    .from('roles')
    .insert({
      company_id: companyId,
      name: data.name,
      description: data.description,
      is_system: false,
    })
    .select()
    .single();

  if (error) throw error;
  return role;
}

export async function updateRole(id: string, data: UpdateRoleData): Promise<Role> {
  const updates: Partial<Role> = {
    name: data.name,
    description: data.description,
  };

  const { data: role, error } = await supabase
    .from('roles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Update permissions if provided
  if (data.permissions) {
    // Delete existing permissions
    await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', id);

    // Insert new permissions
    if (data.permissions.length > 0) {
      const { error: permError } = await supabase
        .from('role_permissions')
        .insert(
          data.permissions.map(actionId => ({
            role_id: id,
            action_id: actionId,
          }))
        );

      if (permError) throw permError;
    }
  }

  return role;
}

export async function deleteRole(id: string): Promise<void> {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id)
    .neq('is_system', true); // Prevent deletion of system roles

  if (error) throw error;
}