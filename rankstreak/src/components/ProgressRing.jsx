import React from 'react';
import { GOAL_DAYS_PER_RANK } from '../streakLogic.js';
import { getRankConfig } from '../themesConfig.js';

export function ProgressRing({ daysThisMonth = 0, currentRank = 1 }) {
  const rankConfig = getRankConfig(currentRank);
  const accent = rankConfig.accentHex;

  const radius = 54;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const target = GOAL_DAYS_PER_RANK;
  const percentage = Math.min(100, Math.max(0, (daysThisMonth / target) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-36 h-36 transform -rotate-90 drop-shadow-lg" viewBox="0 0 120 120">
        {/* Background Track Ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#1F2937"
          strokeWidth={strokeWidth}
        />
        {/* Glowing Progress Arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${accent})`
          }}
        />
      </svg>

      {/* Center Progress Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <span className="text-2xl font-black font-mono tracking-tight text-white drop-shadow-md">
          {daysThisMonth}
          <span className="text-xs text-slate-400 font-normal">/{target}</span>
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
          Days This Rank
        </span>
      </div>
    </div>
  );
}
