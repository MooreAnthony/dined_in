import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { Modal } from '../../components/common/Modal';
import { NoCompanySelected } from '../../components/dashboard/NoCompanySelected';
import { supabase } from '../../services/supabase/config';

interface ApiUser {
  id: string;
  email: string;
  provider: {
    name: string;
    code: string;
  };
  is_active: boolean;
  created_at: string;
}

interface Provider {
  id: string;
  name: string;
  code: string;
}

export const ApiUsers: React.FC = () => {
  const { currentCompany } = useCompany();
  const [apiUsers, setApiUsers] = useState<ApiUser[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    provider_id: '',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!currentCompany?.id) return;
      
      setIsLoading(true);
      try {
        const [usersData, providersData] = await Promise.all([
          supabase
            .from('api_users')
            .select(`
              *,
              provider:providers (
                id,
                name,
                code
              )
            `)
            .eq('company_id', currentCompany.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('providers')
            .select('*')
            .eq('is_active', true)
            .order('name')
        ]);

        if (usersData.error) throw usersData.error;
        if (providersData.error) throw providersData.error;

        setApiUsers(usersData.data);
        setProviders(providersData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load API users');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentCompany?.id]);

  const handleCreateApiUser = async () => {
    if (!currentCompany?.id) return;

    try {
      const { data, error } = await supabase
        .from('api_users')
        .insert({
          company_id: currentCompany.id,
          email: formData.email,
          provider_id: formData.provider_id,
        })
        .select(`
          *,
          provider:providers (
            id,
            name,
            code
          )
        `)
        .single();

      if (error) throw error;

      setApiUsers(prev => [data, ...prev]);
      setNewToken(data.token);
      setShowCreateModal(false);
      setShowTokenModal(true);
      setFormData({ email: '', provider_id: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API user');
    }
  };

  const handleRemoveApiUser = async (id: string) => {
    if (!confirm('Are you sure you want to remove this API user?')) return;

    try {
      const { error } = await supabase
        .from('api_users')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setApiUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove API user');
    }
  };

  const handleCopyToken = async () => {
    if (!newToken) return;
    
    try {
      await navigator.clipboard.writeText(newToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  if (!currentCompany) {
    return <NoCompanySelected />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-dark-text-primary">API Users</h1>
          <div className="px-3 py-1 rounded-full bg-dark-accent/10 text-dark-accent text-sm">
            {apiUsers.length} Total
          </div>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add API User
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
            <p className="text-dark-text-secondary">Loading API users...</p>
          </div>
        </div>
      ) : (
        <div className="bg-dark-secondary rounded-lg border border-dark-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-dark-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {apiUsers.map((user) => (
                <tr key={user.id} className="hover:bg-dark-primary/50">
                  <td className="px-6 py-4 text-dark-text-primary">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-dark-text-secondary">
                    {user.provider.name}
                  </td>
                  <td className="px-6 py-4 text-dark-text-secondary">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${user.is_active
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-red-400/10 text-red-400'
                      }
                    `}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveApiUser(user.id)}
                      className="p-2 text-red-400 hover:text-red-400"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create API User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add API User"
      >
        <div className="space-y-6">
          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Provider
            </label>
            <select
              aria-label="Provider"
              value={formData.provider_id}
              onChange={(e) => setFormData(prev => ({ ...prev, provider_id: e.target.value }))}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
            >
              <option value="">Select a provider</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateApiUser}
              disabled={!formData.email || !formData.provider_id}
            >
              Create API User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Token Modal */}
      <Modal
        isOpen={showTokenModal}
        onClose={() => {
          setShowTokenModal(false);
          setNewToken(null);
          setCopiedToken(false);
        }}
        title="API Token Generated"
      >
        <div className="space-y-6">
          <p className="text-dark-text-secondary">
            Your API token has been generated. Please copy it now as it won't be shown again.
          </p>

          <div className="p-4 bg-dark-primary rounded-lg border border-dark-border">
            <div className="flex items-center justify-between gap-4">
              <code className="text-dark-text-primary font-mono text-sm break-all">
                {newToken}
              </code>
              <Button
                variant="outline"
                onClick={handleCopyToken}
                className="shrink-0"
              >
                {copiedToken ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowTokenModal(false);
                setNewToken(null);
                setCopiedToken(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};