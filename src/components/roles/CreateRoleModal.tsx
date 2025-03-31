import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import type { CreateRoleData } from '../../types/roles';

const createRoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
});

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoleData) => Promise<void>;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoleData>({
    resolver: zodResolver(createRoleSchema),
  });

  const handleFormSubmit = async (data: CreateRoleData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Role"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-dark-border">
          <div className="p-2 bg-dark-accent/10 rounded-lg">
            <Shield className="w-5 h-5 text-dark-accent" />
          </div>
          <div>
            <h3 className="font-medium text-dark-text-primary">Role Details</h3>
            <p className="text-sm text-dark-text-secondary">
              Create a new role to manage permissions
            </p>
          </div>
        </div>

        <FormField
          label="Role Name"
          {...register('name')}
          error={errors.name?.message}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-dark-text-secondary">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
              text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50
              resize-none"
            placeholder="Describe the purpose of this role..."
          />
          {errors.description && (
            <p className="text-sm text-red-400">{errors.description.message}</p>
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
            Create Role
          </Button>
        </div>
      </form>
    </Modal>
  );
};