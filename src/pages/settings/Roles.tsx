import React, { useState } from 'react';
import { Plus, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { Button } from '../../components/common/Button';
import { RolesList } from '../../components/roles/RolesList';
import { CreateRoleModal } from '../../components/roles/CreateRoleModal';
import { useRoles } from '../../hooks/useRoles';

export const Roles: React.FC = () => {
  const { currentCompany } = useCompany();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { roles, isLoading, error, createRole } = useRoles(currentCompany?.id);

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

  const systemRoles = roles.filter(role => role.is_system);
  const customRoles = roles.filter(role => !role.is_system);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-dark-text-primary">Roles</h1>
          <div className="px-3 py-1 rounded-full bg-dark-accent/10 text-dark-accent text-sm">
            {roles.length} Total
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-400/10 text-red-400 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 text-dark-accent animate-spin mx-auto" />
            <p className="text-dark-text-secondary">Loading roles...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Default System Roles */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-dark-accent/10 rounded-lg">
                <Shield className="w-5 h-5 text-dark-accent" />
              </div>
              <h2 className="text-xl font-semibold text-dark-text-primary">Default Roles</h2>
            </div>
            <div className="bg-dark-secondary rounded-lg border border-dark-border">
              <RolesList roles={systemRoles} isSystemRoles={true} />
            </div>
          </div>

          {/* Custom Roles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-dark-accent/10 rounded-lg">
                  <Shield className="w-5 h-5 text-dark-accent" />
                </div>
                <h2 className="text-xl font-semibold text-dark-text-primary">Custom Roles</h2>
              </div>
            </div>
            <RolesList roles={customRoles} isSystemRoles={false} />
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createRole}
      />
    </div>
  );
};