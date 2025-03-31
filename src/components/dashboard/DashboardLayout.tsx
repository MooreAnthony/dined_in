import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { CompanyProvider } from '../../contexts/CompanyContext';

export const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  // Protect dashboard routes
  React.useEffect(() => {
    if (!session) {
      navigate('/signin');
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return (
    <CompanyProvider>
    <div className="flex h-screen bg-dark-primary overflow-hidden">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`
        flex-1 overflow-x-hidden overflow-y-auto bg-dark-primary
        transition-[margin] duration-200 ease-in-out
        ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}
      `}>
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
    </CompanyProvider>
  );
};