import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, KeyRound, Mail, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient.js';

export function AuthModal({ isOpen, onClose, onGuestLogin, onUserAuthenticated }) {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Click "Continue in Demo Mode" below to test immediately!');
      return;
    }

    setLoading(true);

    try {
      if (tab === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username || email.split('@')[0] }
          }
        });
        if (signUpError) throw signUpError;
        onUserAuthenticated(data.user);
        onClose();
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        onUserAuthenticated(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-black font-mono tracking-wider uppercase">
            RankStreak Account
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Back up your rank progress & share read-only views with friends.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-900 p-1 mb-4 border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
              tab === 'login' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            LOG IN
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
              tab === 'signup' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'signup' && (
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Username</label>
              <input
                type="text"
                required
                placeholder="ShadowSeeker"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {error && <p className="text-xs text-rose-400 font-mono text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-cyan-950"
          >
            {loading ? 'AUTHENTICATING...' : tab === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Demo Mode Action */}
        <div className="mt-6 pt-4 border-t border-slate-900 text-center">
          <button
            onClick={() => {
              onGuestLogin();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold border border-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            CONTINUE IN DEMO / OFFLINE GUEST MODE
          </button>
        </div>
      </div>
    </div>
  );
}
