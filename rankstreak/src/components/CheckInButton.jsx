import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, Flame } from 'lucide-react';
import { getRankConfig } from '../themesConfig.js';

export function CheckInButton({
  isCheckedInToday = false,
  isRecovery = false,
  recoveryDaysLeft = 0,
  currentRank = 1,
  onCheckIn,
  readOnly = false
}) {
  const [isPressing, setIsPressing] = useState(false);
  const rankConfig = getRankConfig(currentRank);
  const accent = rankConfig.accentHex;

  // Synthesize Web Audio chime on check-in tap!
  const playAudioChime = (isRecoveryChime = false) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isRecoveryChime) {
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(440 + currentRank * 20, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880 + currentRank * 30, ctx.currentTime + 0.35);
      }

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio not supported or allowed without interaction
    }
  };

  const handleClick = () => {
    if (isCheckedInToday || readOnly) return;
    setIsPressing(true);
    playAudioChime(isRecovery);

    if (navigator.vibrate) {
      navigator.vibrate(isRecovery ? [80, 50, 80] : [100]);
    }

    setTimeout(() => {
      setIsPressing(false);
      onCheckIn();
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center my-6">
      {/* Outer Halo ring */}
      <div className="relative group">
        <div
          className={`absolute -inset-4 rounded-full blur-xl transition-all duration-700 opacity-60 ${
            isCheckedInToday
              ? 'bg-emerald-500 opacity-40'
              : isRecovery
              ? 'bg-amber-500 opacity-50 animate-pulse'
              : 'opacity-70 animate-pulse'
          }`}
          style={{ backgroundColor: isCheckedInToday ? undefined : isRecovery ? undefined : accent }}
        />

        <button
          onClick={handleClick}
          disabled={isCheckedInToday || readOnly}
          className={`relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 flex flex-col items-center justify-center text-center p-4 transition-all duration-300 transform shadow-2xl backdrop-blur-md ${
            isPressing ? 'scale-95' : 'hover:scale-105 active:scale-95'
          } ${
            isCheckedInToday
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 cursor-default shadow-emerald-900/50'
              : isRecovery
              ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-amber-900/50 hover:bg-amber-900/80'
              : 'bg-black/80 text-white shadow-black/80 hover:brightness-110'
          }`}
          style={{
            borderColor: isCheckedInToday ? '#10B981' : isRecovery ? '#F59E0B' : accent
          }}
        >
          {isCheckedInToday ? (
            <>
              <CheckCircle2 className="w-14 h-14 mb-2 text-emerald-400 animate-bounce" />
              <span className="text-lg font-black tracking-wide font-mono">CHECKED IN</span>
              <span className="text-xs text-emerald-300/80 mt-1">Calendar Day Complete</span>
            </>
          ) : isRecovery ? (
            <>
              <ShieldAlert className="w-14 h-14 mb-2 text-amber-400 animate-pulse" />
              <span className="text-base font-black tracking-wider text-amber-300">RECOVERY CHECK-IN</span>
              <span className="text-xs text-amber-200/70 mt-1 font-mono">Void Progress ({recoveryDaysLeft}d left)</span>
            </>
          ) : (
            <>
              <div className="relative mb-2">
                <Flame className="w-16 h-16 animate-pulse" style={{ color: accent }} />
                <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-white animate-spin" />
              </div>
              <span className="text-xl font-black tracking-widest font-mono uppercase drop-shadow-md">
                CHECK IN
              </span>
              <span className="text-xs opacity-75 mt-1 font-sans">Tap once for Day +1</span>
            </>
          )}
        </button>
      </div>

      {readOnly && (
        <span className="mt-3 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
          🔒 Read-Only Viewer Mode
        </span>
      )}
    </div>
  );
}
