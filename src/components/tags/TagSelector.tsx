import React, { useState } from 'react';
import { Plus, Search, Tag as TagIcon, LucideIcon } from 'lucide-react';
import { Button } from '../common/Button';
import { CreateTagModal } from './CreateTagModal';
import type { Tag } from '../../types/tags';
import { Icons } from '../../components/tags/IconPicker';

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagIds: string[]) => void;
  category: 'contact' | 'booking';
  onCreateTag?: (tag: Tag) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags,
  onTagSelect,
  category,
  onCreateTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagClick = (tagId: string, event: React.MouseEvent) => {
    // Prevent form submission
    event.preventDefault();
    event.stopPropagation();
    
    const isSelected = selectedTags.includes(tagId);
    const newSelectedTags = isSelected
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagSelect(newSelectedTags);
  };

  const handleCreateTag = async (tag: Tag) => {
    onCreateTag?.(tag);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            className="w-full pl-10 pr-4 py-2 bg-dark-secondary border border-dark-border rounded-lg
              text-dark-text-primary placeholder-dark-text-muted
              focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
          />
        </div>
        {onCreateTag && (
          <Button
            variant="outline"
            onClick={() => setIsCreateModalOpen(true)}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Tag
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filteredTags.map(tag => {
          const IconComponent = (Icons[tag.icon as keyof typeof Icons] || TagIcon) as LucideIcon;
          const isSelected = selectedTags.includes(tag.id);
            const style = {
            backgroundColor: isSelected ? tag.color : 'transparent',
            color: isSelected ? '#FFFFFF' : tag.color,
            borderColor: tag.color,
          };
          
          return (
            <button
              key={tag.id}
              onClick={(e) => handleTagClick(tag.id, e)}
              type="button"
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium border
                transition-colors duration-200
                flex items-center gap-2 hover:bg-opacity-10
              `}
              style={style}
            >
              <IconComponent className="w-4 h-4" />
              {tag.name}
            </button>
          );
        })}
      </div>

      {onCreateTag && (
        <CreateTagModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (data) => {
            const tag: Tag = {
              ...data,
              id: '',
              company_id: '',
              created_by: '',
              created_at: new Date().toISOString(),
              modified_at: new Date().toISOString(),
              modified_by: '',
              contact_count: 0,
              sort_order: 0,
            };
            await handleCreateTag(tag);
          }}
          category={category}
        />
      )}
    </div>
  );
};