import React, { useState } from 'react';
export {Icons};

import {
  Tag,
  Star,
  Heart,
  Briefcase,
  Cake,
  AlertTriangle,
  Gift,
  Sun,
  Baby,
  Utensils,
  Clock,
  Search,
} from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

const Icons = [
  { name: 'Tag', component: Tag },
  { name: 'Star', component: Star },
  { name: 'Heart', component: Heart },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Cake', component: Cake },
  { name: 'AlertTriangle', component: AlertTriangle },
  { name: 'Gift', component: Gift },
  { name: 'Sun', component: Sun },
  { name: 'Baby', component: Baby },
  { name: 'Utensils', component: Utensils },
  { name: 'Clock', component: Clock },
];

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = Icons.filter(icon =>
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search icons..."
          className="w-full pl-10 pr-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
            text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
        />
      </div>

      <div className="grid grid-cols-6 gap-2">
        {filteredIcons.map(({ name, component: Icon }) => (
          <button
            key={name}
            type="button"
            aria-label={`Select ${name} icon`}
            onClick={() => onChange(name)}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              transition-colors duration-200
              ${value === name
                ? 'bg-dark-accent text-white'
                : 'bg-dark-primary text-dark-text-secondary hover:bg-dark-accent/10'
              }
            `}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
};