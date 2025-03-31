import React from 'react';
import { Building2 } from 'lucide-react';

export const NoCompanySelected: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center space-y-4">
        <div className="p-4 bg-dark-accent/10 rounded-full inline-block">
          <Building2 className="w-12 h-12 text-dark-accent" />
        </div>
        <h2 className="text-xl font-semibold text-dark-text-primary">
          No Company Selected
        </h2>
        <p className="text-dark-text-secondary max-w-md">
          Please select a company from the dropdown menu in the sidebar to view its data and manage its operations.
        </p>
      </div>
    </div>
  );
};