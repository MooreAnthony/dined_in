import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tag as TagIcon } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';
import type { CreateTagData } from '../../types/tags';

const createTagSchema = z.object({
  name: z.string().min(2, 'Tag name must be at least 2 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().min(1, 'Icon is required'),
  category: z.enum(['contact', 'booking']),
});

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTagData) => Promise<void>;
  category: 'contact' | 'booking';
}

export const CreateTagModal: React.FC<CreateTagModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTagData>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      category,
      color: '#6366F1',
      icon: 'Tag',
    },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const handleFormSubmit = async (data: CreateTagData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create ${category === 'contact' ? 'Contact' : 'Booking'} Tag`}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-dark-border">
          <div className="p-2 bg-dark-accent/10 rounded-lg">
            <TagIcon className="w-5 h-5 text-dark-accent" />
          </div>
          <div>
            <h3 className="font-medium text-dark-text-primary">Tag Details</h3>
            <p className="text-sm text-dark-text-secondary">
              Create a new tag to organize your {category}s
            </p>
          </div>
        </div>

        <FormField
          label="Tag Name"
          {...register('name')}
          error={errors.name?.message}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-dark-text-secondary">
            Tag Color
          </label>
          <ColorPicker
            value={selectedColor}
            onChange={(color) => setValue('color', color)}
          />
          {errors.color && (
            <p className="text-sm text-red-400">{errors.color.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-dark-text-secondary">
            Tag Icon
          </label>
          <IconPicker
            value={selectedIcon}
            onChange={(icon) => setValue('icon', icon)}
          />
          {errors.icon && (
            <p className="text-sm text-red-400">{errors.icon.message}</p>
          )}
        </div>

        <input type="hidden" {...register('category')} />

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
            Create Tag
          </Button>
        </div>
      </form>
    </Modal>
  );
}