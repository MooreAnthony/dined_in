import React, { useState } from 'react';
import { Plus, Tag as TagIcon, AlertCircle, Loader2 } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { Button } from '../../components/common/Button';
import { TagsList } from '../../components/tags/TagsList';
import { CreateTagModal } from '../../components/tags/CreateTagModal';
import { useTags } from '../../hooks/useTags';

export const Tags: React.FC = () => {
  const { currentCompany } = useCompany();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'contact' | 'booking'>('contact');
  const { tags, isLoading, error, createTag, updateTag, deleteTag, reorderTags } = useTags(
    currentCompany?.id,
    selectedCategory
  );

  if (!currentCompany) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-dark-text-primary">
            No Company Selected
          </h2>
          <p className="text-dark-text-secondary">
            Please select a company to manage tags
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
          <h1 className="text-3xl font-bold text-dark-text-primary">Tags</h1>
          <div className="px-3 py-1 rounded-full bg-dark-accent/10 text-dark-accent text-sm">
            {tags.length} Total
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Tag
        </Button>
      </div>

      {/* Category Selector */}
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === 'contact' ? 'primary' : 'outline'}
          onClick={() => setSelectedCategory('contact')}
        >
          Contact Tags
        </Button>
        <Button
          variant={selectedCategory === 'booking' ? 'primary' : 'outline'}
          onClick={() => setSelectedCategory('booking')}
        >
          Booking Tags
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
            <p className="text-dark-text-secondary">Loading tags...</p>
          </div>
        </div>
      ) : (
        <TagsList
          tags={tags}
          onUpdate={updateTag}
          onDelete={deleteTag}
          onReorder={reorderTags}
        />
      )}

      {/* Create Tag Modal */}
      <CreateTagModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createTag}
        category={selectedCategory}
      />
    </div>
  );
}