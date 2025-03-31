import React from 'react';
import type { Tag } from '../../types/tags';

interface TagListProps {
  tags: Tag[];
  onRemove?: (tagId: string) => void;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  onRemove,
}) => {
  if (tags.length === 0) {
    return (
      <div className="text-dark-text-secondary text-sm">
        No tags
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <div
          key={tag.id}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium
            bg-[${tag.color}] text-white
            flex items-center gap-2
          `}
        >
          {tag.name}
          {onRemove && (
            <button
              onClick={() => onRemove(tag.id)}
              className="w-4 h-4 rounded-full bg-white/20 
                hover:bg-white/30 transition-colors duration-200
                flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};