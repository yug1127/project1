import React from 'react';
import { Home, Calendar, Trophy, Users, UserCheck } from 'lucide-react';
import { getRankConfig } from '../themesConfig.js';

export function Navbar({ activeTab = 'home', onTabChange, currentRank = 1, onOpenAuth, username = 'ShadowSeeker' }) {
  const rankConfig = getRankConfig(currentRank);
  const accent = rankConfig.accentHex;

  const tabs = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'History', icon: Calendar },
    { id: 'roadmap', label: 'Ranks', icon: Trophy },
    { id: 'friends', label: 'Friends', icon: Users }
  ];

  return (
    <>
      {/* Desktop Top Header Bar */}
      <header className="hidden sm:flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-slate-800 relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-black shadow-lg"
               style={{ backgroundColor: accent }}>
            R{currentRank}
          </div>
          <div>
            <h1 className="text-lg font-black font-mono tracking-wider uppercase text-white">
              RankStreak
            </h1>
            <span className="text-[10px] font-mono text-slate-400 block -mt-1">
              R{currentRank} • {rankConfig.name}
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                style={{ color: isActive ? accent : undefined }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Auth / Account Profile */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>{username}</span>
        </button>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-mono font-bold transition-all ${
                isActive ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-300'
              }`}
              style={{ color: isActive ? accent : undefined }}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
