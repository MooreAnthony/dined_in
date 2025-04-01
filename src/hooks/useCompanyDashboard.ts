import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/config';
import type { Account } from './useAccounts';

interface DashboardMetrics {
  totalContacts: number;
  activeContacts: number;
  newContactsLast30Days: number;
  contactsBySource: {
    Website: number;
    Referral: number;
    Event: number;
    Other: number;
  };
  contactMethodPreferences: {
    Email: number;
    SMS: number;
    Phone: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'contact_created' | 'contact_updated';
  contactName: string;
  timestamp: string;
}

export const useCompanyDashboard = (selectedCompany: Account | null) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedCompany) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch total contacts
        const { data: totalData, error: totalError } = await supabase
          .from('contacts')
          .select('count', { count: 'exact' })
          .eq('company_id', selectedCompany.id);

        if (totalError) throw totalError;

        // Fetch active contacts
        const { data: activeData, error: activeError } = await supabase
          .from('contacts')
          .select('count', { count: 'exact' })
          .eq('company_id', selectedCompany.id)
          .eq('is_active', true);

        if (activeError) throw activeError;

        // Fetch new contacts in last 30 days
        const { data: newData, error: newError } = await supabase
          .from('contacts')
          .select('count', { count: 'exact' })
          .eq('company_id', selectedCompany.id)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (newError) throw newError;

        // Fetch contact source distribution
        const { data: sourceData, error: sourceError } = await supabase
          .from('contacts')
          .select('contact_source, count')
          .eq('company_id', selectedCompany.id);

        if (sourceError) throw sourceError;

        // Fetch contact method preferences
        const { data: methodData, error: methodError } = await supabase
          .from('contacts')
          .select('preferred_contact_method, count')
          .eq('company_id', selectedCompany.id);

        if (methodError) throw methodError;

        // Fetch recent activity
        const { data: activityData, error: activityError } = await supabase
          .from('contacts')
          .select('id, first_name, last_name, created_at, modified_at')
          .eq('company_id', selectedCompany.id)
          .order('modified_at', { ascending: false })
          .limit(10);

        if (activityError) throw activityError;

        // Transform the data
        const sourceCounts = {
          Website: 0,
          Referral: 0,
          Event: 0,
          Other: 0,
          ...Object.fromEntries(
            sourceData.map(({ contact_source, count }) => [contact_source, count])
          ),
        };

        const methodCounts = {
          Email: 0,
          SMS: 0,
          Phone: 0,
          ...Object.fromEntries(
            methodData.map(({ preferred_contact_method, count }) => [preferred_contact_method, count])
          ),
        };

        setMetrics({
          totalContacts: totalData[0]?.count || 0,
          activeContacts: activeData[0]?.count || 0,
          newContactsLast30Days: newData[0]?.count || 0,
          contactsBySource: sourceCounts,
          contactMethodPreferences: methodCounts,
        });

        setRecentActivity(
          activityData.map(contact => ({
            id: contact.id,
            type: contact.created_at === contact.modified_at ? 'contact_created' : 'contact_updated',
            contactName: `${contact.first_name} ${contact.last_name}`,
            timestamp: contact.modified_at,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedCompany]);

  return {
    metrics,
    recentActivity,
    isLoading,
    error,
  };
};