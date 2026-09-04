import React from 'react';
import { RANKS } from '../themesConfig.js';
import { RankBadge } from './RankBadge.jsx';
import { Lock, Sparkles, Trophy, Flame } from 'lucide-react';

export function RankRoadmap({ currentRank = 1 }) {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-slate-800 shadow-2xl my-4 text-slate-100">
      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b border-slate-800">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/90 border border-slate-800 mb-2">
          <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black font-mono tracking-wider uppercase bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
          Rank Hierarchy Roadmap
        </h2>
        <p className="text-xs text-slate-400 font-sans mt-1 max-w-md mx-auto">
          Complete 30 valid check-ins per month to ascend to the next Rank. Each rank unlocks a distinct obsidian vein background theme & particle effect.
        </p>
      </div>

      {/* 15 Vertical Rank Cards */}
      <div className="relative space-y-4">
        {/* Connecting Vertical Line */}
        <div className="absolute left-6 sm:left-10 top-6 bottom-6 w-1 bg-gradient-to-b from-emerald-500 via-amber-400 to-purple-600 rounded-full z-0 opacity-40" />

        {RANKS.map(rankItem => {
          const isCurrent = rankItem.id === currentRank;
          const isUnlocked = rankItem.id <= currentRank;

          return (
            <div
              key={rankItem.id}
              className={`relative z-10 p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                isCurrent
                  ? 'bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 border-2 shadow-xl scale-[1.02]'
                  : isUnlocked
                  ? 'bg-slate-900/40 border-slate-800 opacity-90'
                  : 'bg-black/40 border-slate-900 opacity-50 grayscale'
              }`}
              style={{
                borderColor: isCurrent ? rankItem.accentHex : isUnlocked ? '#334155' : '#1E293B',
                boxShadow: isCurrent ? `0 0 20px ${rankItem.glowColor}` : undefined
              }}
            >
              {/* Badge */}
              <div className="shrink-0">
                <RankBadge rank={rankItem.id} size="sm" showTitle={false} />
              </div>

              {/* Rank Info Details */}
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-base sm:text-lg font-black font-mono tracking-wide"
                      style={{ color: rankItem.accentHex }}
                    >
                      R{rankItem.id} — {rankItem.name}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider text-black"
                      style={{ backgroundColor: rankItem.accentHex }}
                    >
                      {rankItem.colorName}
                    </span>
                  </div>

                  {isCurrent ? (
                    <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/60 animate-pulse">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      ACTIVE RANK
                    </span>
                  ) : !isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      <Lock className="w-3 h-3" />
                      LOCKED
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-400">UNLOCKED</span>
                  )}
                </div>

                <p className="text-xs text-slate-300/90 font-sans mt-1">
                  <strong>Aesthetic:</strong> {rankItem.backgroundTreatment}
                </p>

                <p className="text-xs italic text-slate-400 mt-2 border-l-2 pl-2" style={{ borderColor: rankItem.accentHex }}>
                  "{rankItem.quote}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
