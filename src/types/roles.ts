export interface Role {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  permissions?: string[];
  created_at: string;
  created_by: string | null;
  modified_at: string;
  modified_by: string | null;
}

export interface RoleWithPermissions extends Role {
  permissions: string[];
}

export interface SystemAction {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  action_id: string;
  created_at: string;
  created_by: string | null;
}

export interface CreateRoleData {
  name: string;
  description?: string;
}

export interface UpdateRoleData extends Partial<CreateRoleData> {
  permissions?: string[]; // Array of action IDs
}