import React, { useState } from 'react';
import { Wrench, Play, RotateCcw, FastForward, AlertTriangle, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';
import { RANKS } from '../themesConfig.js';

export function DevSimulatorToolbar({
  currentRank = 1,
  onSimulateCheckIn,
  onSimulateMiss,
  onSimulate30DaysRankUp,
  onSelectRank,
  onResetData
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-4 z-40">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900/90 border border-slate-700 text-cyan-400 text-xs font-mono font-bold shadow-2xl backdrop-blur-md hover:bg-slate-800 transition-all"
      >
        <Wrench className="w-4 h-4 text-amber-400" />
        <span>SIMULATOR</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-72 p-4 rounded-2xl bg-black/95 border border-slate-800 shadow-2xl backdrop-blur-xl text-slate-200 text-left font-mono text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              TESTING & TIME TRAVEL
            </span>
            <span className="text-[10px] text-slate-500">Dev Tools</span>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1.5">
            <button
              onClick={onSimulateCheckIn}
              className="w-full text-left px-3 py-2 rounded-lg bg-emerald-950/80 border border-emerald-800/80 hover:bg-emerald-900 text-emerald-300 font-bold transition-colors flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              Check In Today (+1 Day)
            </button>

            <button
              onClick={onSimulateMiss}
              className="w-full text-left px-3 py-2 rounded-lg bg-amber-950/80 border border-amber-800/80 hover:bg-amber-900 text-amber-300 font-bold transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Simulate Missed Yesterday (Recovery)
            </button>

            <button
              onClick={onSimulate30DaysRankUp}
              className="w-full text-left px-3 py-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 hover:bg-cyan-900 text-cyan-300 font-bold transition-colors flex items-center gap-2"
            >
              <FastForward className="w-3.5 h-3.5 text-cyan-400" />
              Simulate 30 Days (Rank Up!)
            </button>
          </div>

          {/* Rank Theme Switcher */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Preview Rank Theme (1-15)
            </label>
            <select
              value={currentRank}
              onChange={(e) => onSelectRank(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none"
            >
              {RANKS.map(r => (
                <option key={r.id} value={r.id}>
                  R{r.id} - {r.name} ({r.colorName})
                </option>
              ))}
            </select>
          </div>

          {/* Reset State */}
          <button
            onClick={onResetData}
            className="w-full py-2 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All App Data
          </button>
        </div>
      )}
    </div>
  );
}
