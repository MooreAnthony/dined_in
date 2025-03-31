/*
  # Add Roles Management Schema

  1. New Tables
    - `roles`: System roles configuration
    - `role_permissions`: Permission mappings for roles
    - `system_actions`: Available system actions/permissions
    
  2. Security
    - Enable RLS
    - Add policies for owners and admins only
*/

-- Create roles table
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_system boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  modified_at timestamptz DEFAULT now(),
  modified_by uuid REFERENCES auth.users(id),
  UNIQUE(company_id, name)
);

-- Create system_actions table
CREATE TABLE system_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create role_permissions table
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  action_id uuid REFERENCES system_actions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(role_id, action_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_actions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_roles_company ON roles(company_id);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_system_actions_category ON system_actions(category);

-- Create policies
CREATE POLICY "Owners and admins can manage roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = roles.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners and admins can manage role permissions"
  ON role_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      JOIN company_users cu ON cu.company_id = r.company_id
      WHERE r.id = role_permissions.role_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "All users can view system actions"
  ON system_actions
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default system actions
INSERT INTO system_actions (code, name, description, category) VALUES
  ('manage_roles', 'Manage Roles', 'Create and manage system roles', 'System'),
  ('manage_users', 'Manage Users', 'Manage user accounts and permissions', 'Users'),
  ('view_reports', 'View Reports', 'Access system reports and analytics', 'Reports'),
  ('manage_locations', 'Manage Locations', 'Create and manage locations', 'Locations'),
  ('manage_bookings', 'Manage Bookings', 'Create and manage bookings', 'Bookings'),
  ('manage_contacts', 'Manage Contacts', 'Create and manage contacts', 'Contacts'),
  ('manage_settings', 'Manage Settings', 'Configure system settings', 'System'),
  ('manage_integrations', 'Manage Integrations', 'Configure system integrations', 'System');

-- Insert default roles with explicit column references
WITH role_data AS (
  SELECT
    r.role_name,
    r.role_description,
    c.id AS company_id
  FROM (
    VALUES
      ('owner', 'Full system access and control'),
      ('admin', 'Administrative access with some restrictions'),
      ('user', 'Standard user access'),
      ('reporting', 'Read-only access to reports')
  ) AS r(role_name, role_description)
  CROSS JOIN companies c
)
INSERT INTO roles (name, description, is_system, company_id)
SELECT
  role_name,
  role_description,
  true,
  company_id
FROM role_data;

-- Grant all permissions to owner role
INSERT INTO role_permissions (role_id, action_id)
SELECT r.id, sa.id
FROM roles r
CROSS JOIN system_actions sa
WHERE r.name = 'owner';

-- Grant most permissions to admin role
INSERT INTO role_permissions (role_id, action_id)
SELECT r.id, sa.id
FROM roles r
CROSS JOIN system_actions sa
WHERE r.name = 'admin'
AND sa.code != 'manage_roles';