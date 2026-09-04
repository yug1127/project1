import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export function RecoveryBanner({ recoveryDaysLeft = 1 }) {
  return (
    <div className="w-full max-w-md my-3 p-4 rounded-xl bg-gradient-to-r from-amber-950/90 via-orange-950/80 to-amber-950/90 border border-amber-500/60 shadow-lg shadow-amber-950/50 flex items-center gap-3 animate-pulse">
      <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="flex-1 text-left">
        <h4 className="text-sm font-bold text-amber-200 tracking-wide flex items-center gap-2">
          <span>RECOVERY PERIOD ACTIVE</span>
          <Clock className="w-3.5 h-3.5 text-amber-400" />
        </h4>
        <p className="text-xs text-amber-300/80 mt-0.5 leading-relaxed">
          {recoveryDaysLeft === 1 ? (
            <><strong>1 more day</strong> until check-ins count towards streak & rank!</>
          ) : (
            <><strong>{recoveryDaysLeft} more days</strong> of recovery before check-ins count toward rank!</>
          )}
        </p>
      </div>
    </div>
  );
}
