import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import {
  fetchLocations,
  fetchLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  subscribeToLocations,
  fetchVenueGroups,
  createVenueGroup as createVenueGroupService
} from '../services/supabase/locations';
import type { Location, VenueGroup, CreateLocationData, UpdateLocationData } from '../types/locations';

export function useLocations() {
  const { currentCompany } = useCompany();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = useCallback(async () => {
    if (!currentCompany?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchLocations(currentCompany.id);
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
      console.error('Error loading locations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (!currentCompany?.id) return;

    const unsubscribe = subscribeToLocations(currentCompany.id, () => {
      loadLocations();
    });

    return () => {
      unsubscribe();
    };
  }, [currentCompany?.id, loadLocations]);

  const handleCreate = async (data: CreateLocationData) => {
    if (!currentCompany?.id) throw new Error('No company selected');

    try {
      await createLocation(currentCompany.id, data);
      await loadLocations();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdate = async (id: string, data: UpdateLocationData) => {
    try {
      await updateLocation(id, data);
      await loadLocations();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLocation(id);
      await loadLocations();
    } catch (err) {
      throw err;
    }
  };

  return {
    locations,
    isLoading,
    error,
    createLocation: handleCreate,
    updateLocation: handleUpdate,
    deleteLocation: handleDelete,
    refresh: loadLocations,
  };
}

export function useVenueGroups(companyId: string | undefined) {
  const [venueGroups, setVenueGroups] = useState<VenueGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVenueGroups = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchVenueGroups(companyId);
      setVenueGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load venue groups');
      console.error('Error loading venue groups:', err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadVenueGroups();
  }, [loadVenueGroups]);

  const createVenueGroup = async (name: string, description?: string) => {
    if (!companyId) throw new Error('No company selected');

    try {
      const newGroup = await createVenueGroupService(name, companyId, description);
      setVenueGroups(prev => [...prev, newGroup]);
      return newGroup;
    } catch (err) {
      throw err;
    }
  };

  return {
    venueGroups,
    isLoading,
    error,
    createVenueGroup,
    refresh: loadVenueGroups,
  };
}

export function useLocation(id: string | undefined) {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLocation() {
      if (!id) {
        setLocation(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchLocation(id);
        setLocation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load location');
        console.error('Error loading location:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadLocation();
  }, [id]);

  return { location, isLoading, error };
}