import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Loader2, AlertCircle, Save, Trash2 } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { useRole } from '../../hooks/useRoles';
import type { UpdateRoleData } from '../../types/roles';

export const RoleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const { role, systemActions, permissions, isLoading, error } = useRole(id);
  const [formData, setFormData] = useState<UpdateRoleData>({
    name: role?.name || '',
    description: role?.description || '',
    permissions: permissions.map(p => p.action_id),
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!currentCompany) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-dark-text-primary">
            No Company Selected
          </h2>
          <p className="text-dark-text-secondary">
            Please select a company to manage roles
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-dark-accent animate-spin mx-auto" />
          <p className="text-dark-text-secondary">Loading role details...</p>
        </div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-dark-text-primary">
            Failed to load role
          </h2>
          <p className="text-dark-text-secondary">{error}</p>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/settings/roles')}
          >
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  const handlePermissionToggle = (actionId: string) => {
    setFormData(prev => {
      const currentPermissions = prev.permissions || [];
      const newPermissions = currentPermissions.includes(actionId)
        ? currentPermissions.filter(id => id !== actionId)
        : [...currentPermissions, actionId];
      
      return {
        ...prev,
        permissions: newPermissions,
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save changes
      setIsSaving(false);
      navigate('/dashboard/settings/roles');
    } catch (error) {
      console.error('Failed to save role:', error);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      // Delete role
      navigate('/dashboard/settings/roles');
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  // Group actions by category
  const actionsByCategory = systemActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, typeof systemActions>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/settings/roles')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-dark-text-primary">
              {role.name}
            </h1>
            <p className="text-dark-text-secondary mt-1">
              {role.description || 'No description provided'}
            </p>
          </div>
          {role.is_system && (
            <span className="px-3 py-1 text-sm font-medium bg-dark-accent/10 text-dark-accent rounded-full">
              System Role
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!role.is_system && (
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Role
            </Button>
          )}
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={role.is_system}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Role Details */}
      <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-dark-border">
          <div className="p-2 bg-dark-accent/10 rounded-lg">
            <Shield className="w-5 h-5 text-dark-accent" />
          </div>
          <div>
            <h3 className="font-medium text-dark-text-primary">Role Details</h3>
            <p className="text-sm text-dark-text-secondary">
              Basic information about the role
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            label="Role Name"
            value={role.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={role.is_system}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Description
            </label>
            <textarea
              value={role.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              disabled={role.is_system}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50
                resize-none disabled:opacity-50"
              placeholder="Describe the purpose of this role..."
            />
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-dark-accent/10 rounded-lg">
              <Shield className="w-5 h-5 text-dark-accent" />
            </div>
            <div>
              <h3 className="font-medium text-dark-text-primary">Permissions</h3>
              <p className="text-sm text-dark-text-secondary">
                Configure what actions this role can perform
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(actionsByCategory).map(([category, actions]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-lg font-medium text-dark-text-primary">
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map(action => {
                  const isChecked = formData.permissions?.includes(action.id);
                  return (
                    <label
                      key={action.id}
                      className={`
                        flex items-center p-4 rounded-lg border-2 transition-all duration-200
                        ${isChecked
                          ? 'border-dark-accent bg-dark-accent/5'
                          : 'border-dark-border bg-dark-primary/50'
                        }
                        ${role.is_system ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-dark-accent/50'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handlePermissionToggle(action.id)}
                        disabled={role.is_system}
                        className="w-4 h-4 text-dark-accent border-dark-border rounded
                          focus:ring-dark-accent bg-dark-secondary"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-dark-text-primary">
                          {action.name}
                        </div>
                        <div className="text-sm text-dark-text-secondary">
                          {action.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};