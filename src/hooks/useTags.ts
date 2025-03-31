import { useState, useEffect } from 'react';
import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
  updateTagOrder,
} from '../services/supabase/tags';
import type { Tag, CreateTagData, UpdateTagData } from '../types/tags';

export function useTags(companyId: string | undefined, category?: 'contact' | 'booking') {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      if (!companyId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchTags(companyId, category);
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tags');
        console.error('Error loading tags:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, [companyId, category]);

  const handleCreateTag = async (data: CreateTagData) => {
    if (!companyId) throw new Error('No company selected');

    try {
      const newTag = await createTag(companyId, data);
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateTag = async (id: string, data: UpdateTagData) => {
    try {
      const updatedTag = await updateTag(id, data);
      setTags(prev => prev.map(tag => 
        tag.id === id ? updatedTag : tag
      ));
      return updatedTag;
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const handleReorderTags = async (orderedIds: string[]) => {
    if (!companyId || !category) return;

    try {
      await updateTagOrder(companyId, category, orderedIds);
      const reorderedTags = orderedIds.map((id, index) => {
        const tag = tags.find(t => t.id === id);
        return tag ? { ...tag, sort_order: index } : null;
      }).filter((tag): tag is Tag => tag !== null);
      
      setTags(reorderedTags);
    } catch (err) {
      throw err;
    }
  };

  return {
    tags,
    isLoading,
    error,
    createTag: handleCreateTag,
    updateTag: handleUpdateTag,
    deleteTag: handleDeleteTag,
    reorderTags: handleReorderTags,
  };
}