import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Role } from '../../types/roles';

interface RolesListProps {
  roles: Role[];
  isSystemRoles?: boolean;
}

export const RolesList: React.FC<RolesListProps> = ({ roles, isSystemRoles = false }) => {
  const navigate = useNavigate();

  if (roles.length === 0) {
    return (
      <div className="bg-dark-secondary rounded-lg border border-dark-border p-8">
        <div className="text-center space-y-3">
          <div className="text-dark-text-primary font-medium">
            {isSystemRoles ? 'No default roles available' : 'No custom roles defined'}
          </div>
          <div className="text-dark-text-secondary">
            {isSystemRoles 
              ? 'System roles will appear here when available'
              : 'Create your first custom role to start managing permissions'
            }
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="divide-y divide-dark-border">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => navigate(`/dashboard/settings/roles/${role.id}`)}
            className={`w-full p-6 text-left hover:bg-dark-primary/50 transition-colors ${
              isSystemRoles ? 'cursor-default' : ''
            }`}
            disabled={isSystemRoles}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-dark-text-primary">
                    {role.name}
                  </h3>
                  {role.is_system && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-dark-accent/10 text-dark-accent rounded-full">
                      System
                    </span>
                  )}
                </div>
                {role.description && (
                  <p className="text-dark-text-secondary">{role.description}</p>
                )}
              </div>
              {!isSystemRoles && (
                <ChevronRight className="w-5 h-5 text-dark-text-muted" />
              )}
            </div>
          </button>
        ))}
      </div>
  );
};