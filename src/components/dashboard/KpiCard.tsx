import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  description?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  description,
}) => {
  return (
    <div className="bg-dark-secondary p-6 rounded-xl border border-dark-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-text-secondary text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-dark-text-primary mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
          {description && (
            <p className="text-dark-text-secondary text-sm mt-2">{description}</p>
          )}
        </div>
        <div className="p-3 bg-dark-accent/10 rounded-lg">
          <Icon className="w-6 h-6 text-dark-accent" />
        </div>
      </div>
    </div>
  );
};