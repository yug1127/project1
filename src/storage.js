// Unified Storage Layer (Fresh Day 1 Start)
import { getLocalDateString } from './streakLogic.js';

const STORAGE_KEY = 'rankstreak_app_data_v2';

const INITIAL_DEMO_DATA = {
  activeUserId: 'user_a',
  users: {
    user_a: {
      id: 'user_a',
      username: 'ShadowSeeker',
      shareId: 'RANK-7829-SEEK',
      current_rank: 1, // Beginner
      current_streak_days: 0, // Day 1 Fresh Start
      days_this_month: 0,
      created_at: getLocalDateString(),
      history: [],
      trustedViewerIds: ['user_b']
    },
    user_b: {
      id: 'user_b',
      username: 'AuraMaster',
      shareId: 'RANK-9931-AURA',
      current_rank: 2,
      current_streak_days: 5,
      days_this_month: 5,
      created_at: '2026-08-15',
      history: [
        { date: '2026-09-01', status: 'counted', checked_in_at: '2026-09-01T06:00:00Z' },
        { date: '2026-09-02', status: 'counted', checked_in_at: '2026-09-02T06:30:00Z' },
        { date: '2026-09-03', status: 'counted', checked_in_at: '2026-09-03T07:15:00Z' }
      ],
      trustedViewerIds: ['user_a']
    }
  },
  followedUserIds: ['user_b']
};

export function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DEMO_DATA;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_DEMO_DATA, ...parsed };
  } catch (err) {
    return INITIAL_DEMO_DATA;
  }
}

export function saveAppState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {}
}

export function resetAppStateToDemo() {
  saveAppState(INITIAL_DEMO_DATA);
  return INITIAL_DEMO_DATA;
}
