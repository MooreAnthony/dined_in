import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import type { Role } from '../../types/roles';
import type { InviteUserData } from '../../types/users';

const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  mobile: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  role_id: z.string().min(1, 'Role is required'),
});

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InviteUserData) => Promise<void>;
  roles: Role[];
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roles,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteUserData>({
    resolver: zodResolver(inviteUserSchema),
  });

  const handleFormSubmit = async (data: InviteUserData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite User"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-dark-border">
          <div className="p-2 bg-dark-accent/10 rounded-lg">
            <UserPlus className="w-5 h-5 text-dark-accent" />
          </div>
          <div>
            <h3 className="font-medium text-dark-text-primary">User Details</h3>
            <p className="text-sm text-dark-text-secondary">
              Invite a new user to join your team
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            {...register('first_name')}
            error={errors.first_name?.message}
          />
          <FormField
            label="Last Name"
            {...register('last_name')}
            error={errors.last_name?.message}
          />
        </div>

        <FormField
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <FormField
          label="Mobile Number"
          placeholder="+1234567890"
          {...register('mobile')}
          error={errors.mobile?.message}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-dark-text-secondary">
            Role
          </label>
          <select
            {...register('role_id')}
            className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
              text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
          >
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role_id && (
            <p className="text-sm text-red-400">{errors.role_id.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
};