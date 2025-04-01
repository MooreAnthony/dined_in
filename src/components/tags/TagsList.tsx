import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Tag as TagIcon, Grip, Edit2, Trash2, Search } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { EditTagModal } from './EditTagModal';
import type { Tag, UpdateTagData } from '../../types/tags';

interface TagsListProps {
  tags: Tag[];
  onUpdate: (id: string, data: UpdateTagData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
}

export const TagsList: React.FC<TagsListProps> = ({
  tags,
  onUpdate,
  onDelete,
  onReorder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tags);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items.map(item => item.id));
  };

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`Are you sure you want to delete the "${tag.name}" tag?`)) return;
    await onDelete(tag.id);
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (tags.length === 0) {
    return (
      <div className="bg-dark-secondary rounded-lg border border-dark-border p-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-dark-accent/10 rounded-full">
              <TagIcon className="w-6 h-6 text-dark-accent" />
            </div>
          </div>
          <div className="text-dark-text-primary font-medium">
            No tags defined
          </div>
          <div className="text-dark-text-secondary">
            Create your first tag to start organizing
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tags..."
          className="w-full pl-12 pr-4 py-3 bg-dark-secondary border border-dark-border rounded-lg
            text-dark-text-primary placeholder-dark-text-muted
            focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
        />
      </div>

      {/* Tags Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tags">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredTags.map((tag, index) => (
                <Draggable key={tag.id} draggableId={tag.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-dark-secondary rounded-lg border border-dark-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div {...provided.dragHandleProps}>
                          <Grip className="w-5 h-5 text-dark-text-muted cursor-grab" />
                        </div>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: tag.color }}
                        >
                          {React.createElement(
                            (Icons[tag.icon as keyof typeof Icons] as React.ComponentType) || TagIcon,
                            { className: "w-4 h-4 text-white" } as React.SVGProps<SVGSVGElement>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-dark-text-primary">
                            {tag.name}
                            <span className="ml-2 text-sm text-dark-text-secondary">
                              ({tag.contact_count})
                            </span>
                          </div>
                          <div className="text-sm text-dark-text-secondary">
                            {tag.category === 'contact' ? 'Contact Tag' : 'Booking Tag'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="p-2"
                            onClick={() => setEditingTag(tag)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="p-2 text-red-400 hover:text-red-400"
                            onClick={() => handleDelete(tag)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Tag Modal */}
      {editingTag && (
        <EditTagModal
          tag={editingTag}
          isOpen={true}
          onClose={() => setEditingTag(null)}
          onSubmit={async (data) => {
            await onUpdate(editingTag.id, data);
            setEditingTag(null);
          }}
        />
      )}
    </>
  );
};