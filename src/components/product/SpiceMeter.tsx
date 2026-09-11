'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { SpiceLevel } from '@/lib/types';

interface SpiceMeterProps {
  level: SpiceLevel;
  showText?: boolean;
}

const SPICE_MAP: Record<SpiceLevel, { count: number; color: string; label: string }> = {
  Mild: { count: 1, color: 'text-amber-500', label: 'Mild Spice' },
  Medium: { count: 2, color: 'text-orange-500', label: 'Medium Spice' },
  Hot: { count: 3, color: 'text-red-500', label: 'Hot & Spicy' },
  'Extra Hot': { count: 4, color: 'text-red-600', label: 'Extra Hot' },
  Fiery: { count: 5, color: 'text-red-700', label: 'Fiery Andhra Heat' },
};

export default function SpiceMeter({ level, showText = true }: SpiceMeterProps) {
  const config = SPICE_MAP[level] || SPICE_MAP['Hot'];

  return (
    <div className="inline-flex items-center gap-1.5" title={`Spice level: ${config.label}`}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Flame
            key={i}
            className={`w-3.5 h-3.5 transition-colors ${
              i < config.count ? `${config.color} fill-current` : 'text-stone-300'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-stone-600 tracking-wide">
          {config.label}
        </span>
      )}
    </div>
  );
}
