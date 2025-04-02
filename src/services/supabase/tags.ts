import { supabase } from './config';
import type { 
  Tag, 
  CreateTagData, 
  UpdateTagData,
} from '../../types/tags';

export async function fetchTags(companyId: string, category?: 'contact' | 'booking'): Promise<Tag[]> {
  let query = supabase
    .from('tags')
    .select(`
      *,
      contact_count:contact_tags(count)
    `)
    .eq('company_id', companyId)
    .order('sort_order');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.map(tag => ({
    ...tag,
    contact_count: tag.contact_count?.[0]?.count || 0
  }));
}

export async function fetchContactTags(contactId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('contact_tags')
    .select(`
      tag_id,
      tag:tags (*)
    `)
  .eq('contact_id', contactId);

  if (error) throw error;
  return data.flatMap(item => item.tag as Tag[]);
}

export async function fetchBookingTags(bookingId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('booking_tags')
    .select(`
      tag_id,
      tag:tags (*)
    `)
    .eq('booking_id', bookingId);

  if (error) throw error;
  return data.map(item => item.tag as unknown as Tag);
}

export async function addContactTags(contactId: string, tagIds: string[]): Promise<void> {
  const { error } = await supabase
    .from('contact_tags')
    .insert(
      tagIds.map(tagId => ({
        contact_id: contactId,
        tag_id: tagId
      }))
    );

  if (error) throw error;
}

export async function addBookingTags(bookingId: string, tagIds: string[]): Promise<void> {
  const { error } = await supabase
    .from('booking_tags')
    .insert(
      tagIds.map(tagId => ({
        booking_id: bookingId,
        tag_id: tagId
      }))
    );

  if (error) throw error;
}

export async function removeContactTags(contactId: string, tagIds: string[]): Promise<void> {
  const { error } = await supabase
    .from('contact_tags')
    .delete()
    .eq('contact_id', contactId)
    .in('tag_id', tagIds);

  if (error) throw error;
}

export async function removeBookingTags(bookingId: string, tagIds: string[]): Promise<void> {
  const { error } = await supabase
    .from('booking_tags')
    .delete()
    .eq('booking_id', bookingId)
    .in('tag_id', tagIds);

  if (error) throw error;
}
export async function createTag(companyId: string, data: CreateTagData): Promise<Tag> {
  const { data: tag, error } = await supabase
    .from('tags')
    .insert({
      company_id: companyId,
      name: data.name,
      color: data.color,
      icon: data.icon,
      category: data.category,
      sort_order: data.sort_order || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return tag;
}

export async function updateTag(id: string, data: UpdateTagData): Promise<Tag> {
  const { data: tag, error } = await supabase
    .from('tags')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return tag;
}

export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateTagOrder(
  companyId: string,
  category: 'contact' | 'booking',
  orderedIds: string[]
): Promise<void> {
  const updates = orderedIds.map((id, index) => ({
    id,
    sort_order: index,
  }));

  const { error } = await supabase
    .from('tags')
    .upsert(updates)
    .eq('company_id', companyId)
    .eq('category', category);

  if (error) throw error;
}