import React from 'react';
import { UsersIcon, Mail, Phone } from 'lucide-react';
import { formatDate } from '../../utils/date';
import type { CompanyUser } from '../../types/users';

interface UsersTableProps {
  users: CompanyUser[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  if (users.length === 0) {
    return (
      <div className="bg-dark-secondary rounded-lg border border-dark-border p-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-dark-accent/10 rounded-full">
              <UsersIcon className="w-6 h-6 text-dark-accent" />
            </div>
          </div>
          <div className="text-dark-text-primary font-medium">
            No users found
          </div>
          <div className="text-dark-text-secondary">
            Invite team members to get started
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-secondary rounded-lg border border-dark-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
              Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
              Contact
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
              Role
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-dark-primary/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-dark-accent/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-dark-accent">
                      {user.first_name[0]}{user.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-dark-text-primary">
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-dark-text-secondary">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-dark-text-secondary">
                    <Phone className="w-4 h-4" />
                    {user.mobile}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${user.role === 'owner'
                    ? 'bg-purple-400/10 text-purple-400'
                    : user.role === 'admin'
                    ? 'bg-blue-400/10 text-blue-400'
                    : 'bg-green-400/10 text-green-400'
                  }
                `}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-dark-text-secondary">
                {formatDate(user.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};