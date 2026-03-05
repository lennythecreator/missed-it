import { create } from 'zustand';

export interface MissedGoal {
  _id: string;
  user: string;
  points: number;
  date: string;
  link?: string;
}

export interface LeaderboardEntry {
  _id: string;
  totalMissed: number;
  totalPoints: number;
}

interface MissedGoalsState {
  missedGoals: MissedGoal[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  addMissedGoal: (payload: {
    user: string;
    points: number;
    date: string;
    link?: string;
  }) => Promise<boolean>;
}

export const useMissedGoalsStore = create<MissedGoalsState>((set) => ({
  missedGoals: [],
  leaderboard: [],
  loading: false,
  error: null,
  fetchAll: async () => {
    try {
      set({ error: null });
      const [goalsRes, leaderboardRes] = await Promise.all([
        fetch('/api/missed-goals', { cache: 'no-store' }),
        fetch('/api/leaderboard', { cache: 'no-store' }),
      ]);
      const goalsData = await goalsRes.json();
      const leaderboardData = await leaderboardRes.json();
      set({
        missedGoals: Array.isArray(goalsData) ? goalsData : [],
        leaderboard: Array.isArray(leaderboardData) ? leaderboardData : [],
      });
    } catch (error) {
      console.error('Failed to fetch data', error);
      set({ error: 'Failed to fetch data' });
    }
  },
  addMissedGoal: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/missed-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          link: payload.link?.trim() || undefined,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit goal');
      }
      return true;
    } catch (error) {
      console.error('Failed to submit goal', error);
      set({ error: 'Failed to submit goal' });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
