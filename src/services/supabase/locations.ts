import { supabase } from './config';
import type { VenueGroup, CreateLocationData, UpdateLocationData } from '../../types/locations';

export async function fetchLocations(companyId: string) {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      venue_group:venue_groups(id, name),
      photos:location_photos(
        id,
        url,
        sort_order
      )
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchLocation(id: string) {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      venue_group:venue_groups(
        id,
        name
      ),
      photos:location_photos(
        id,
        url,
        sort_order
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createLocation(companyId: string, data: CreateLocationData) {
  // Get the current user first
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  if (!user) throw new Error('Not authenticated');

  // Check if location with same client reference exists
  const { data: existing } = await supabase
    .from('locations')
    .select('id')
    .eq('company_id', companyId)
    .eq('client_reference', data.client_reference)
    .single();

  if (existing) {
    throw new Error('A location with this client reference already exists');
  }

  const { data: location, error } = await supabase
    .from('locations')
    .insert({
      ...data,
      company_id: companyId,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return location;
}

export async function updateLocation(id: string, data: UpdateLocationData) {
  // Get the current user first
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  if (!user) throw new Error('Not authenticated');

  const { data: location, error } = await supabase
    .from('locations')
    .update({
      ...data,
      modified_by: user.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return location;
}

export async function deleteLocation(id: string) {
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export function subscribeToLocations(
  companyId: string,
  callback: () => void
) {
  const subscription = supabase
    .channel('locations_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'locations',
        filter: `company_id=eq.${companyId}`,
      },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export async function fetchVenueGroups(companyId: string): Promise<VenueGroup[]> {
  const { data, error } = await supabase
    .from('venue_groups')
    .select('*')
    .eq('company_id', companyId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function createVenueGroup(
  name: string,
  companyId: string,
  description?: string
): Promise<VenueGroup> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  if (!user) throw new Error('Not authenticated');

  // Check if venue group with same name exists
  const { data: existing } = await supabase
    .from('venue_groups')
    .select('id')
    .eq('company_id', companyId)
    .eq('name', name)
    .single();

  if (existing) {
    throw new Error('A venue group with this name already exists');
  }

  const { data, error } = await supabase
    .from('venue_groups')
    .insert({
      name,
      company_id: companyId,
      description,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}