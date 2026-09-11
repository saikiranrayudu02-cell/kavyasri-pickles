'use client';

import React from 'react';
import { DietaryType } from '@/lib/types';

interface DietaryBadgeProps {
  type: DietaryType;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function DietaryBadge({ type, showLabel = false, size = 'md' }: DietaryBadgeProps) {
  const isVeg = type === 'veg';

  const boxSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5';
  const fontSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <div
      className="inline-flex items-center gap-1.5"
      title={isVeg ? '100% Vegetarian (FSSAI Standard)' : 'Non-Vegetarian (FSSAI Standard)'}
    >
      {/* Official FSSAI Style Symbol */}
      <div
        className={`${boxSize} border-2 rounded-xs flex items-center justify-center bg-white shadow-2xs shrink-0 ${
          isVeg ? 'border-emerald-600' : 'border-red-700'
        }`}
      >
        {isVeg ? (
          /* Veg: Green Filled Circle */
          <div className={`${dotSize} rounded-full bg-emerald-600`} />
        ) : (
          /* Non-Veg: Red Filled Triangle */
          <div
            className={`${dotSize} bg-red-700`}
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
        )}
      </div>

      {showLabel && (
        <span
          className={`${fontSize} font-bold tracking-wide ${
            isVeg ? 'text-emerald-800' : 'text-red-900'
          }`}
        >
          {isVeg ? '100% Veg' : 'Non-Veg'}
        </span>
      )}
    </div>
  );
}
