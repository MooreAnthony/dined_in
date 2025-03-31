import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MapPin, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useCompany } from '../../contexts/CompanyContext';
import { useLocations } from '../../hooks/useLocations';
import { NoCompanySelected } from '../../components/dashboard/NoCompanySelected';

export const Locations: React.FC = () => {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const { locations, isLoading, error, deleteLocation } = useLocations();

  const filteredLocations = locations.filter(location => {
    const searchLower = searchQuery.toLowerCase();
    return (
      location.public_name.toLowerCase().includes(searchLower) ||
      location.internal_name.toLowerCase().includes(searchLower) ||
      location.client_reference.toLowerCase().includes(searchLower) ||
      location.address_line1.toLowerCase().includes(searchLower) ||
      location.city.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    try {
      await deleteLocation(id);
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  };

  if (!currentCompany) {
    return <NoCompanySelected />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-400/10 text-red-400 rounded-lg">
        Failed to load locations: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-dark-text-primary">Locations</h1>
          <div className="px-3 py-1 rounded-full bg-dark-accent/10 text-dark-accent text-sm">
            {locations.length} Total
          </div>
        </div>
        <Button
          onClick={() => navigate('/dashboard/settings/locations/new')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search locations..."
          className="w-full pl-12 pr-4 py-3 bg-dark-secondary border border-dark-border rounded-lg
            text-dark-text-primary placeholder-dark-text-muted
            focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
        />
      </div>

      {/* Locations Table */}
      <div className="bg-dark-secondary rounded-lg border border-dark-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">Internal Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">Address</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">Type</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-dark-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8">
                  <div className="flex items-center justify-center text-dark-text-secondary">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading locations...
                  </div>
                </td>
              </tr>
            ) : filteredLocations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="p-3 bg-dark-accent/10 rounded-full">
                        <MapPin className="w-6 h-6 text-dark-accent" />
                      </div>
                    </div>
                    <div className="text-dark-text-primary font-medium">
                      {searchQuery ? 'No locations found' : 'No locations yet'}
                    </div>
                    <div className="text-dark-text-secondary">
                      {searchQuery 
                        ? 'Try adjusting your search terms'
                        : 'Add your first location to get started'}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLocations.map((location) => (
                <tr
                  key={location.id}
                  className="hover:bg-dark-primary/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-dark-text-primary">
                        {location.public_name}
                      </div>
                      <div className="text-sm text-dark-text-secondary">
                        {location.client_reference}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark-text-primary">
                    {location.internal_name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-dark-text-primary">
                        {location.address_line1}
                      </div>
                      <div className="text-sm text-dark-text-secondary">
                        {location.city}, {location.state} {location.postal_code}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-dark-text-primary">
                        {location.venue_type}
                      </div>
                      <div className="text-sm text-dark-text-secondary">
                        {location.venue_group?.name || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        className="p-2"
                        onClick={() => navigate(`/dashboard/settings/locations/${location.id}/edit`)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="p-2 text-red-400 hover:text-red-400"
                        onClick={() => handleDelete(location.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};