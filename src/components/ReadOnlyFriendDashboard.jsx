import React from 'react';
import { ArrowLeft, Lock, ShieldCheck, Flame, Calendar as CalIcon } from 'lucide-react';
import { ObsidianThemeCanvas } from './ObsidianThemeCanvas.jsx';
import { RankBadge } from './RankBadge.jsx';
import { ProgressRing } from './ProgressRing.jsx';
import { CalendarView } from './CalendarView.jsx';
import { RecoveryBanner } from './RecoveryBanner.jsx';
import { getRecoveryStatus } from '../streakLogic.js';
import { getRankConfig } from '../themesConfig.js';

export function ReadOnlyFriendDashboard({ friendUser, onBack }) {
  if (!friendUser) return null;

  const rankConfig = getRankConfig(friendUser.current_rank);
  const accent = rankConfig.accentHex;
  const recoveryInfo = getRecoveryStatus(friendUser.history || []);

  return (
    <div className="relative min-h-screen pb-20 text-slate-100">
      {/* 1. Dynamic Friend Obsidian Canvas Background */}
      <ObsidianThemeCanvas currentRank={friendUser.current_rank} />

      {/* 2. Read-Only Sticky Header Banner */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-cyan-500/40 p-3 sm:p-4 shadow-xl">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK MY DASHBOARD
          </button>

          <div className="flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/60 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-200">
              Viewing <span className="text-white underline">{friendUser.username}</span> (Read-Only)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Content */}
      <div className="relative z-10 max-w-xl mx-auto p-4 text-center">
        {/* Badge & Title */}
        <div className="mt-4 mb-2 flex justify-center">
          <RankBadge rank={friendUser.current_rank} size="lg" showTitle={false} />
        </div>

        <h1 className="text-2xl font-black font-mono tracking-wider uppercase drop-shadow-md" style={{ color: accent }}>
          R{friendUser.current_rank} — {rankConfig.name}
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          {friendUser.username}'s Active Obsidian Theme
        </p>

        {/* Recovery Alert if Active */}
        {recoveryInfo.isRecovery && (
          <div className="mt-4">
            <RecoveryBanner recoveryDaysLeft={recoveryInfo.recoveryDaysLeft} />
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-black/70 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col items-center justify-center">
            <Flame className="w-7 h-7 mb-1 text-amber-400 animate-pulse" />
            <span className="text-2xl font-black font-mono text-white">
              {friendUser.current_streak_days}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">
              Current Streak
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/70 border border-slate-800 shadow-xl backdrop-blur-md flex items-center justify-center">
            <ProgressRing daysThisMonth={friendUser.days_this_month} currentRank={friendUser.current_rank} />
          </div>
        </div>

        {/* Lock Notice */}
        <div className="my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Check-in actions are disabled for read-only viewer connections.</span>
        </div>

        {/* Calendar View */}
        <CalendarView
          history={friendUser.history || []}
          currentStreak={friendUser.current_streak_days}
          currentRank={friendUser.current_rank}
        />
      </div>
    </div>
  );
}
