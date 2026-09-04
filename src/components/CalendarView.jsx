import React, { useState } from 'react';
import { getMonthCalendarGrid } from '../streakLogic.js';
import { ChevronLeft, ChevronRight, Check, AlertOctagon, Flame, Calendar as CalIcon, XCircle } from 'lucide-react';
import { getRankConfig } from '../themesConfig.js';

export function CalendarView({ history = [], currentStreak = 0, currentRank = 1 }) {
  const rankConfig = getRankConfig(currentRank);
  const accent = rankConfig.accentHex;

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const grid = getMonthCalendarGrid(currentYear, currentMonth, history);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Monthly stats calculation
  const monthlyCheckins = history.filter(h => {
    const [y, m] = h.date.split('-').map(Number);
    return y === currentYear && m === currentMonth;
  });

  const countedInMonth = monthlyCheckins.filter(h => h.status === 'counted').length;
  const voidInMonth = monthlyCheckins.filter(h => h.status === 'void_recovery').length;
  const missedInMonth = monthlyCheckins.filter(h => h.status === 'missed').length;

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-slate-800 shadow-2xl my-4 text-slate-100">
      {/* Month Header & Controls */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CalIcon className="w-5 h-5" style={{ color: accent }} />
          <h2 className="text-lg font-black font-mono tracking-wider">
            {monthNames[currentMonth - 1]} {currentYear}
          </h2>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-300 hover:text-white"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-300 hover:text-white"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Grid Matrix */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {grid.map((cell, idx) => {
          if (cell.isBlank) {
            return <div key={`blank-${idx}`} className="h-10 sm:h-12 rounded-lg bg-transparent" />;
          }

          let bgClass = 'bg-slate-900/40 border-slate-800/80 text-slate-400';
          let icon = null;

          if (cell.status === 'counted') {
            bgClass = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 font-bold shadow-lg shadow-emerald-950/50';
            icon = <Check className="w-3.5 h-3.5 text-emerald-400" />;
          } else if (cell.status === 'void_recovery') {
            bgClass = 'bg-amber-950/80 border-amber-500/80 text-amber-300 font-bold shadow-lg shadow-amber-950/50';
            icon = <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />;
          } else if (cell.status === 'missed') {
            bgClass = 'bg-rose-950/80 border-rose-600/80 text-rose-300 font-bold shadow-lg shadow-rose-950/50';
            icon = <XCircle className="w-3.5 h-3.5 text-rose-500" />;
          }

          if (cell.isToday) {
            bgClass += ' ring-2 ring-cyan-400 ring-offset-2 ring-offset-black';
          }

          return (
            <div
              key={cell.dateStr}
              className={`relative h-10 sm:h-12 rounded-xl border flex flex-col items-center justify-center transition-transform hover:scale-105 ${bgClass}`}
            >
              <span className="text-xs font-mono">{cell.dayNumber}</span>
              {icon && <div className="mt-0.5">{icon}</div>}
            </div>
          );
        })}
      </div>

      {/* Legend & Key */}
      <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-300 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
          <span>Counted (+1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500" />
          <span>Void Recovery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-600 shadow-sm shadow-rose-600" />
          <span>Missed</span>
        </div>
      </div>

      {/* Monthly Summary Statistics */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-center">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Counted</span>
          <span className="text-base font-bold font-mono text-emerald-400">{countedInMonth}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Recovery</span>
          <span className="text-base font-bold font-mono text-amber-400">{voidInMonth}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Missed</span>
          <span className="text-base font-bold font-mono text-rose-400">{missedInMonth}</span>
        </div>
      </div>
    </div>
  );
}
