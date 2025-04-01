import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#84CC16', // Lime
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#64748B', // Slate
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
}) => {
  const [isCustom, setIsCustom] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => {
              onChange(color);
              setIsCustom(false);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
            style={{ backgroundColor: color }}
          >
            {value === color && (
              <Check className="w-4 h-4 text-white" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsCustom(true)}
          className="text-sm text-dark-text-secondary hover:text-dark-text-primary"
        >
          Custom color
        </button>
        {isCustom && (
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 bg-transparent border-0 rounded-lg cursor-pointer"
            aria-label="Choose custom color"
          />
        )}
      </div>
    </div>
  );
}