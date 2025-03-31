import React, { useState } from 'react';
import { Plus, Users as UsersIcon, AlertCircle, Loader2 } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { Button } from '../../components/common/Button';
import { UsersTable } from '../../components/users/UsersTable';
import { InviteUserModal } from '../../components/users/InviteUserModal';
import { useCompanyUsers } from '../../hooks/useCompanyUsers';

export const Users: React.FC = () => {
  const { currentCompany } = useCompany();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { users, roles, isLoading, error, inviteUser } = useCompanyUsers(currentCompany?.id);

  if (!currentCompany) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-dark-text-primary">
            No Company Selected
          </h2>
          <p className="text-dark-text-secondary">
            Please select a company to manage users
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-dark-text-primary">Users</h1>
          <div className="px-3 py-1 rounded-full bg-dark-accent/10 text-dark-accent text-sm">
            {users.length} Total
          </div>
        </div>
        <Button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Invite User
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
            <p className="text-dark-text-secondary">Loading users...</p>
          </div>
        </div>
      ) : (
        <UsersTable users={users} />
      )}

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={inviteUser}
        roles={roles}
      />
    </div>
  );
};