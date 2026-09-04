import React, { useState } from 'react';
import { Users, UserPlus, Copy, Check, Eye, ShieldCheck, Share2, Sparkles } from 'lucide-react';
import { RankBadge } from './RankBadge.jsx';
import { getRankConfig } from '../themesConfig.js';

export function FriendsView({
  currentUser,
  allUsersMap = {},
  followedUserIds = [],
  onAddFriend,
  onViewFriendDashboard
}) {
  const [inputShareId, setInputShareId] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const currentRankConfig = getRankConfig(currentUser?.current_rank || 1);
  const accent = currentRankConfig.accentHex;

  const handleCopyShareId = () => {
    if (!currentUser?.shareId) return;
    navigator.clipboard.writeText(currentUser.shareId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const target = inputShareId.trim();
    if (!target) return;

    // Search user by shareId or username
    const foundUser = Object.values(allUsersMap).find(
      u => u.shareId?.toLowerCase() === target.toLowerCase() || u.username?.toLowerCase() === target.toLowerCase()
    );

    if (!foundUser) {
      setErrorMsg('No user found with that Share ID or Username.');
      return;
    }

    if (foundUser.id === currentUser.id) {
      setErrorMsg('You cannot add your own Share ID.');
      return;
    }

    if (followedUserIds.includes(foundUser.id)) {
      setErrorMsg(`You are already following ${foundUser.username}.`);
      return;
    }

    onAddFriend(foundUser.id);
    setSuccessMsg(`Successfully connected to ${foundUser.username}!`);
    setInputShareId('');
  };

  // Find people who follow currentUser but currentUser hasn't added back yet
  const followersNotAddedBack = Object.values(allUsersMap).filter(
    u => u.id !== currentUser.id &&
         u.trustedViewerIds?.includes(currentUser.id) &&
         !followedUserIds.includes(u.id)
  );

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-slate-800 shadow-2xl my-4 text-slate-100">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b border-slate-800">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/90 border border-slate-800 mb-2">
          <Users className="w-7 h-7 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-black font-mono tracking-wider uppercase">
          Trusted Viewers & Friends
        </h2>
        <p className="text-xs text-slate-400 font-sans mt-1">
          Share your daily progress with trusted accountability partners in read-only mode.
        </p>
      </div>

      {/* Share My Progress Card */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            Your Share ID
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Read-Only Enabled
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={currentUser?.shareId || 'RANK-7829-SEEK'}
            className="flex-1 bg-black/80 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono font-bold tracking-wider text-cyan-300 select-all focus:outline-none"
          />
          <button
            onClick={handleCopyShareId}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-lg shadow-cyan-950"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>
      </div>

      {/* Add Connection Form */}
      <form onSubmit={handleAddSubmit} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 mb-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
          <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
          Add Connection by Share ID or Username
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. RANK-9931-AURA or AuraMaster"
            value={inputShareId}
            onChange={(e) => setInputShareId(e.target.value)}
            className="flex-1 bg-black/60 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs px-4 py-2 rounded-lg transition-colors"
          >
            ADD
          </button>
        </div>

        {errorMsg && <p className="text-xs text-rose-400 mt-2 font-mono">{errorMsg}</p>}
        {successMsg && <p className="text-xs text-emerald-400 mt-2 font-mono">{successMsg}</p>}
      </form>

      {/* Reciprocal Prompts (User B followed you) */}
      {followersNotAddedBack.length > 0 && (
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Reciprocal Connection Prompts
          </h4>
          {followersNotAddedBack.map(fUser => (
            <div key={fUser.id} className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
              <div className="text-left">
                <span className="text-sm font-bold text-amber-200">{fUser.username}</span>
                <span className="text-xs text-amber-400/80 block">is following your progress!</span>
              </div>
              <button
                onClick={() => onAddFriend(fUser.id)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                Add Back
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Following List */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          People You Follow ({followedUserIds.length})
        </h3>

        {followedUserIds.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-900/30 border border-slate-800 text-slate-500 text-xs font-mono">
            You are not following anyone yet. Enter a Share ID above to start accountability tracking!
          </div>
        ) : (
          followedUserIds.map(friendId => {
            const friend = allUsersMap[friendId];
            if (!friend) return null;
            const friendRank = getRankConfig(friend.current_rank);

            return (
              <div
                key={friend.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between transition-all hover:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <RankBadge rank={friend.current_rank} size="sm" showTitle={false} />
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono">{friend.username}</span>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase text-black"
                        style={{ backgroundColor: friendRank.accentHex }}
                      >
                        R{friend.current_rank} {friendRank.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      🔥 Streak: {friend.current_streak_days} days | Month: {friend.days_this_month}/30
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onViewFriendDashboard(friend.id)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold px-3 py-2 rounded-lg border border-slate-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  VIEW
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
