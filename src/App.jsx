import React, { useState, useEffect } from 'react';
import { loadAppState, saveAppState, resetAppStateToDemo } from './lib/storage.js';
import {
  getLocalDateString,
  getRecoveryStatus,
  evaluateMissedDays,
  executeCheckIn,
  GOAL_DAYS_PER_RANK,
  addDaysToDateString
} from './lib/streakLogic.js';
import { getRankConfig } from './lib/themesConfig.js';

import { ObsidianThemeCanvas } from './components/ObsidianThemeCanvas.jsx';
import { RankBadge } from './components/RankBadge.jsx';
import { CheckInButton } from './components/CheckInButton.jsx';
import { RecoveryBanner } from './components/RecoveryBanner.jsx';
import { ProgressRing } from './components/ProgressRing.jsx';
import { CalendarView } from './components/CalendarView.jsx';
import { RankRoadmap } from './components/RankRoadmap.jsx';
import { FriendsView } from './components/FriendsView.jsx';
import { ReadOnlyFriendDashboard } from './components/ReadOnlyFriendDashboard.jsx';
import { RankTransitionOverlay } from './components/RankTransitionOverlay.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { DevSimulatorToolbar } from './components/DevSimulatorToolbar.jsx';
import { Navbar } from './components/Navbar.jsx';

import { Flame, ShieldAlert, Sparkles, Trophy, Calendar, Users } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState(() => loadAppState());
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'calendar' | 'roadmap' | 'friends'
  const [viewingFriendId, setViewingFriendId] = useState(null);
  const [transitionEvent, setTransitionEvent] = useState(null); // { type: 'promoted'|'demoted', oldRank, newRank }
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const activeUserId = appState.activeUserId || 'user_a';
  const currentUser = appState.users[activeUserId] || appState.users.user_a;

  // Sync state changes to storage
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Evaluate missed calendar days on load
  useEffect(() => {
    if (!currentUser) return;
    const todayStr = getLocalDateString();
    const evaluatedHistory = evaluateMissedDays(
      currentUser.history || [],
      currentUser.created_at || '2026-08-01',
      todayStr
    );

    if (JSON.stringify(evaluatedHistory) !== JSON.stringify(currentUser.history)) {
      setAppState(prev => ({
        ...prev,
        users: {
          ...prev.users,
          [activeUserId]: {
            ...prev.users[activeUserId],
            history: evaluatedHistory
          }
        }
      }));
    }
  }, [activeUserId]);

  const todayStr = getLocalDateString();
  const history = currentUser?.history || [];
  const todayEntry = history.find(h => h.date === todayStr);
  const isCheckedInToday = Boolean(todayEntry && todayEntry.checked_in_at);
  const recoveryInfo = getRecoveryStatus(history, todayStr);
  const currentRank = currentUser?.current_rank || 1;
  const rankConfig = getRankConfig(currentRank);

  // Core Check-In Handler
  const handleCheckIn = () => {
    const oldRank = currentUser.current_rank;
    const updatedUser = executeCheckIn(currentUser, todayStr);

    setAppState(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [activeUserId]: updatedUser
      }
    }));

    // Trigger promotion/demotion animation if rank changed
    if (updatedUser.current_rank !== oldRank) {
      setTransitionEvent({
        type: updatedUser.current_rank > oldRank ? 'promoted' : 'demoted',
        oldRank,
        newRank: updatedUser.current_rank
      });
    }
  };

  // Dev Simulator: Simulate Missed Yesterday
  const handleSimulateMiss = () => {
    const yesterdayStr = addDaysToDateString(todayStr, -1);
    const updatedHistory = history.filter(h => h.date !== yesterdayStr && h.date !== todayStr);
    updatedHistory.push({ date: yesterdayStr, status: 'missed', checked_in_at: null });

    const newRecovery = getRecoveryStatus(updatedHistory, todayStr);

    setAppState(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [activeUserId]: {
          ...prev.users[activeUserId],
          history: updatedHistory.sort((a, b) => a.date.localeCompare(b.date))
        }
      }
    }));
  };

  // Dev Simulator: Fast Forward 30 Days (Rank Up!)
  const handleSimulate30DaysRankUp = () => {
    const oldRank = currentUser.current_rank;
    const nextRank = Math.min(15, oldRank + 1);

    setAppState(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [activeUserId]: {
          ...prev.users[activeUserId],
          current_rank: nextRank,
          days_this_month: 0,
          current_streak_days: (prev.users[activeUserId].current_streak_days || 0) + 30
        }
      }
    }));

    setTransitionEvent({
      type: 'promoted',
      oldRank,
      newRank: nextRank
    });
  };

  // Dev Simulator: Force Select Rank Theme (1-15)
  const handleSelectRank = (rankLevel) => {
    const oldRank = currentUser.current_rank;
    setAppState(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [activeUserId]: {
          ...prev.users[activeUserId],
          current_rank: rankLevel
        }
      }
    }));

    if (rankLevel !== oldRank) {
      setTransitionEvent({
        type: rankLevel > oldRank ? 'promoted' : 'demoted',
        oldRank,
        newRank: rankLevel
      });
    }
  };

  // Add Friend Handler
  const handleAddFriend = (friendId) => {
    const currentFollowed = appState.followedUserIds || [];
    if (!currentFollowed.includes(friendId)) {
      setAppState(prev => ({
        ...prev,
        followedUserIds: [...currentFollowed, friendId]
      }));
    }
  };

  // Reset App Data
  const handleResetData = () => {
    const fresh = resetAppStateToDemo();
    setAppState(fresh);
    setViewingFriendId(null);
    setActiveTab('home');
  };

  // Render Read-Only Friend Dashboard if viewing friend
  if (viewingFriendId) {
    const friendUser = appState.users[viewingFriendId];
    return (
      <ReadOnlyFriendDashboard
        friendUser={friendUser}
        onBack={() => setViewingFriendId(null)}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-slate-100 font-sans pb-24 sm:pb-12 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* 1. Dynamic Canvas Obsidian Theme Background */}
      <ObsidianThemeCanvas currentRank={currentRank} />

      {/* 2. Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRank={currentRank}
        onOpenAuth={() => setIsAuthOpen(true)}
        username={currentUser?.username || 'ShadowSeeker'}
      />

      {/* 3. Main Body Content Based on Active Tab */}
      <main className="relative z-10 max-w-xl mx-auto px-4 pt-4 text-center">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Badge */}
            <div className="flex flex-col items-center justify-center pt-2">
              <RankBadge rank={currentRank} size="lg" showTitle={false} />
              <h2
                className="text-2xl font-black font-mono tracking-wider uppercase mt-2 drop-shadow-md"
                style={{ color: rankConfig.accentHex }}
              >
                R{currentRank} — {rankConfig.name}
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {rankConfig.backgroundTreatment}
              </span>
            </div>

            {/* Recovery Alert Banner if active */}
            {recoveryInfo.isRecovery && (
              <RecoveryBanner recoveryDaysLeft={recoveryInfo.recoveryDaysLeft} />
            )}

            {/* Today's Giant Interactive Check-In Button */}
            <CheckInButton
              isCheckedInToday={isCheckedInToday}
              isRecovery={recoveryInfo.isRecovery}
              recoveryDaysLeft={recoveryInfo.recoveryDaysLeft}
              currentRank={currentRank}
              onCheckIn={handleCheckIn}
            />

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Streak Card */}
              <div className="p-4 rounded-2xl bg-black/70 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col items-center justify-center hover:border-slate-700 transition-colors">
                <Flame className="w-8 h-8 mb-1 text-amber-400 animate-pulse" />
                <span className="text-3xl font-black font-mono text-white">
                  {currentUser?.current_streak_days || 0}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1">
                  Current Streak (Days)
                </span>
              </div>

              {/* Progress Ring Card */}
              <div className="p-4 rounded-2xl bg-black/70 border border-slate-800 backdrop-blur-md shadow-xl flex items-center justify-center hover:border-slate-700 transition-colors">
                <ProgressRing
                  daysThisMonth={currentUser?.days_this_month || 0}
                  currentRank={currentRank}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="animate-fadeIn">
            <CalendarView
              history={history}
              currentStreak={currentUser?.current_streak_days || 0}
              currentRank={currentRank}
            />
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="animate-fadeIn">
            <RankRoadmap currentRank={currentRank} />
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="animate-fadeIn">
            <FriendsView
              currentUser={currentUser}
              allUsersMap={appState.users}
              followedUserIds={appState.followedUserIds || []}
              onAddFriend={handleAddFriend}
              onViewFriendDashboard={(friendId) => setViewingFriendId(friendId)}
            />
          </div>
        )}
      </main>

      {/* 4. Rank Promotion / Demotion Full-Screen Overlay */}
      {transitionEvent && (
        <RankTransitionOverlay
          eventType={transitionEvent.type}
          oldRank={transitionEvent.oldRank}
          newRank={transitionEvent.newRank}
          onClose={() => setTransitionEvent(null)}
        />
      )}

      {/* 5. Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onGuestLogin={() => {
          setIsAuthOpen(false);
        }}
        onUserAuthenticated={(user) => {
          setIsAuthOpen(false);
        }}
      />

      {/* 6. Time Travel / Dev Simulator Toolbar */}
      <DevSimulatorToolbar
        currentRank={currentRank}
        onSimulateCheckIn={handleCheckIn}
        onSimulateMiss={handleSimulateMiss}
        onSimulate30DaysRankUp={handleSimulate30DaysRankUp}
        onSelectRank={handleSelectRank}
        onResetData={handleResetData}
      />
    </div>
  );
}
