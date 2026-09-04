import React, { useEffect } from 'react';
import { getRankConfig } from '../themesConfig.js';
import { RankBadge } from './RankBadge.jsx';
import { Sparkles, Trophy, ShieldAlert, Flame, ChevronRight } from 'lucide-react';

export function RankTransitionOverlay({
  eventType = 'promoted', // 'promoted' | 'demoted'
  oldRank = 1,
  newRank = 2,
  onClose
}) {
  const newRankConfig = getRankConfig(newRank);
  const isPromoted = eventType === 'promoted';
  const accent = newRankConfig.accentHex;

  // Trigger confetti burst on promotion
  useEffect(() => {
    if (isPromoted && window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: [accent, '#FFD700', '#22D3EE', '#FFFFFF']
      });
    }
  }, [isPromoted, accent]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Radial Background Glow */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-1000 animate-pulse"
        style={{
          background: `radial-gradient(circle at center, ${newRankConfig.glowColor} 0%, transparent 70%)`
        }}
      />

      <div className="relative z-10 max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-950/90 border-2 shadow-2xl text-center space-y-6"
           style={{ borderColor: accent }}>
        
        {/* Header Icon */}
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-black/80 border border-slate-800 shadow-xl">
          {isPromoted ? (
            <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
          ) : (
            <ShieldAlert className="w-12 h-12 text-rose-500 animate-pulse" />
          )}
        </div>

        {/* Title */}
        <div>
          <h2
            className="text-2xl sm:text-3xl font-black font-mono tracking-wider uppercase drop-shadow-md"
            style={{ color: isPromoted ? accent : '#F43F5E' }}
          >
            {isPromoted ? 'RANK PROMOTION!' : 'RANK DEMOTION'}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {isPromoted
              ? '30 Valid Days Completed! Theme Unlocked.'
              : 'Streak Reset. Reverting Rank & Theme.'}
          </p>
        </div>

        {/* Badge Morph Transition Display */}
        <div className="flex items-center justify-center gap-6 my-4 py-4 rounded-2xl bg-black/60 border border-slate-900">
          <div className="opacity-50 scale-90">
            <RankBadge rank={oldRank} size="sm" showTitle={true} />
          </div>

          <div className="flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-slate-500 animate-pulse" />
          </div>

          <div className="scale-110">
            <RankBadge rank={newRank} size="md" showTitle={true} />
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs italic text-slate-300">
            "{newRankConfig.quote}"
          </p>
          <span className="text-[10px] text-slate-400 font-mono mt-2 block uppercase tracking-widest">
            Aesthetic: {newRankConfig.backgroundTreatment}
          </span>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl font-mono font-bold text-sm tracking-wider uppercase transition-transform transform active:scale-95 shadow-xl text-black"
          style={{ backgroundColor: accent }}
        >
          CONTINUE JOURNEY
        </button>
      </div>
    </div>
  );
}
