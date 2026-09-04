import React from 'react';
import { getRankConfig } from '../themesConfig.js';

export function RankBadge({ rank = 1, size = 'md', showTitle = true }) {
  const config = getRankConfig(rank);
  const accent = config.accentHex;

  // Size mappings
  const sizeMap = {
    sm: { box: 'w-10 h-10', text: 'text-xs', iconSize: 14 },
    md: { box: 'w-16 h-16', text: 'text-base', iconSize: 22 },
    lg: { box: 'w-24 h-24', text: 'text-xl', iconSize: 32 },
    xl: { box: 'w-32 h-32', text: 'text-3xl', iconSize: 44 }
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex flex-col items-center justify-center group">
      <div className={`relative ${dim.box} flex items-center justify-center transition-transform duration-300 transform group-hover:scale-105`}>
        {/* Outer Glow Halo */}
        <div
          className="absolute inset-0 rounded-full blur-md opacity-60 transition-opacity group-hover:opacity-100"
          style={{ backgroundColor: accent }}
        />

        {/* SVG Hexagon Gem Frame */}
        <svg className="absolute inset-0 w-full h-full drop-shadow-lg" viewBox="0 0 100 100">
          <polygon
            points="50,5 92,27 92,73 50,95 8,73 8,27"
            fill="#0A0A0F"
            stroke={accent}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <polygon
            points="50,12 85,30 85,70 50,88 15,70 15,30"
            fill="none"
            stroke={accent}
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Rank Number & Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <span
            className={`font-black font-mono tracking-wider ${dim.text} drop-shadow-md`}
            style={{ color: accent }}
          >
            R{rank}
          </span>
        </div>
      </div>

      {showTitle && (
        <span
          className="mt-1 text-xs font-semibold tracking-wider uppercase drop-shadow-sm font-sans"
          style={{ color: accent }}
        >
          {config.name}
        </span>
      )}
    </div>
  );
}
