'use client';

import { useState, useEffect } from 'react';

interface MissedGoal {
  _id: string;
  user: string;
  points: number;
  date: string;
  link?: string;
}

interface LeaderboardEntry {
  _id: string;
  totalMissed: number;
  totalPoints: number;
}

type Tab = 'log' | 'leaderboard' | 'history';

export default function MissedGoalsApp() {
  const [currentTab, setCurrentTab] = useState<Tab>('log');
  const [missedGoals, setMissedGoals] = useState<MissedGoal[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [user, setUser] = useState('');
  const [points, setPoints] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [goalsRes, leaderboardRes] = await Promise.all([
        fetch('/api/missed-goals'),
        fetch('/api/leaderboard'),
      ]);
      const goalsData = await goalsRes.json();
      const leaderboardData = await leaderboardRes.json();
      setMissedGoals(Array.isArray(goalsData) ? goalsData : []);
      setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch('/api/missed-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, points, date, link: link.trim() || undefined }),
      });
      if (response.ok) {
        setUser('');
        setPoints(1);
        setDate(new Date().toISOString().split('T')[0]);
        setLink('');
        await fetchData();
        setCurrentTab('history'); // Switch to history after logging
      }
    } catch (error) {
      console.error('Failed to submit goal', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      
      {/* --- LOG A MISS VIEW --- */}
      {currentTab === 'log' && (
        <div className="relative flex h-auto min-h-screen w-full flex-col football-pitch overflow-x-hidden pb-24">
          <div className="pitch-line w-full h-1 top-1/2 -translate-y-1/2 border-t-2 border-white/20"></div>
          <div className="pitch-line w-32 h-32 rounded-full border-2 border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          
          <header className="relative z-10 flex items-center bg-primary/90 backdrop-blur-md p-4 pb-4 justify-between border-b border-white/10">
            <div className="text-white flex size-10 shrink-0 items-center justify-center bg-white/20 rounded-lg">
              <span className="material-symbols-outlined">sports_soccer</span>
            </div>
            <h2 className="text-white text-xl font-extrabold leading-tight tracking-tight flex-1 text-center uppercase italic">Missed It!</h2>
            <div className="flex w-10 items-center justify-end">
              <button className="text-white">
                <span className="material-symbols-outlined">notifications</span>
              </button>
            </div>
          </header>

          <main className="relative z-10 px-4 pt-8 max-w-md mx-auto w-full">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-t-4 border-referee-yellow">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="bg-red-600 text-white p-4 rounded-lg rotate-[-5deg] shadow-lg flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl">style</span>
                  <span className="font-black text-xs uppercase tracking-widest">Red Card Offense</span>
                </div>
              </div>
              <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-black leading-tight text-center pb-6 uppercase italic">
                Log a Shameful Miss ⚽️
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">person</span> Player Name
                  </label>
                  <select
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-14 focus:ring-primary focus:border-primary px-4 outline-none"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                  >
                    <option value="" disabled>Who missed the sitter?</option>
                    {['Lenny', 'Tobi', 'Oba', 'Charles', 'Sam', 'Mahbad', 'Tikkzy', 'Segun', 'Fortune'].map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">payments</span> Fine Amount ($)
                  </label>
                  <input
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-14 focus:ring-primary focus:border-primary px-4 outline-none"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_today</span> Date of Shame
                  </label>
                  <input
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-14 focus:ring-primary focus:border-primary px-4 outline-none"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">videocam</span> Evidence (Link)
                  </label>
                  <input
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-14 focus:ring-primary focus:border-primary px-4 outline-none"
                    placeholder="https://link-to-the-horror.com"
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full bg-referee-yellow hover:bg-yellow-400 text-black font-black text-2xl py-5 rounded-xl shadow-[0_8px_0_0_#ca8a04] active:shadow-none active:translate-y-1 transition-all uppercase italic tracking-tighter flex items-center justify-center gap-3 disabled:opacity-50"
                  type="submit"
                >
                  {loading ? 'LOGGING...' : 'MISSED IT! 🥅'}
                </button>
              </form>
            </div>

            {/* Hall of Shame Preview */}
            <div className="mt-8">
              <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">history</span> Recent Hall of Shame
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {missedGoals.slice(0, 5).map((goal) => (
                  <div key={goal._id} className="min-w-[140px] bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10">
                    <div className="w-full h-20 rounded bg-slate-800 mb-2 overflow-hidden flex items-center justify-center text-white/20">
                      <span className="material-symbols-outlined text-4xl">block</span>
                    </div>
                    <p className="text-white text-xs font-bold truncate">{goal.user}</p>
                    <p className="text-white/60 text-[10px]">${goal.points} Fine</p>
                  </div>
                ))}
                {missedGoals.length === 0 && <p className="text-white/40 text-xs italic">No entries yet...</p>}
              </div>
            </div>
          </main>
        </div>
      )}

      {/* --- LEADERBOARD VIEW --- */}
      {currentTab === 'leaderboard' && (
        <div className="relative flex min-h-screen w-full flex-col turf-gradient overflow-x-hidden text-slate-100 max-w-md mx-auto shadow-2xl pb-24">
          <header className="flex items-center p-4 pb-2 justify-between border-b border-white/10">
            <button onClick={() => setCurrentTab('log')} className="text-slate-100 flex size-12 shrink-0 items-center justify-start">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col items-center">
              <h1 className="text-white text-xl font-extrabold leading-tight tracking-tight uppercase italic">The Wall of Shame</h1>
              <p className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">Season 2024 • Top Offenders</p>
            </div>
            <div className="flex w-12 items-center justify-end">
              <button className="flex items-center justify-center rounded-full h-10 w-10 bg-white/5 text-white">
                <span className="material-symbols-outlined">info</span>
              </button>
            </div>
          </header>

          <div className="flex-1 px-4 py-4">
            <div className="grid grid-cols-12 gap-2 px-2 py-3 text-[10px] font-black uppercase tracking-widest text-primary border-b border-white/5">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Striker (Victim)</div>
              <div className="col-span-2 text-center">Misses</div>
              <div className="col-span-3 text-right">Debt</div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              {leaderboard.map((entry, idx) => (
                <div 
                  key={entry._id} 
                  className={`grid grid-cols-12 items-center gap-2 rounded-lg p-3 relative overflow-hidden ${
                    idx === 0 ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 p-1">
                      <span className="material-symbols-outlined text-red-600 text-lg fill-1">style</span>
                    </div>
                  )}
                  <div className={`col-span-1 font-black text-lg italic ${idx === 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {idx + 1}
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <span className="text-white font-extrabold text-sm line-clamp-1">{entry._id}</span>
                    {idx === 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded uppercase italic">😬 Worst Striker</span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-center font-black text-white text-base">{entry.totalMissed}</div>
                  <div className={`col-span-3 text-right font-black text-base ${idx === 0 ? 'text-red-400' : 'text-slate-100'}`}>
                    ${entry.totalPoints.toFixed(2)}
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && <p className="text-center text-slate-500 py-8">No records found.</p>}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-primary/20 border-2 border-dashed border-primary/40 text-center">
              <p className="text-xs italic text-primary font-bold">
                "{leaderboard[0]?._id || 'Everyone'} is currently funding the end-of-season party. Absolute legend."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- HISTORY VIEW --- */}
      {currentTab === 'history' && (
        <div className="relative flex h-auto min-h-screen w-full flex-col grass-gradient overflow-x-hidden pb-24 max-w-md mx-auto shadow-2xl">
          <header className="flex items-center bg-transparent p-4 pb-2 justify-between sticky top-0 z-10 backdrop-blur-md bg-primary/80 border-b border-white/10">
            <div className="text-white flex size-12 shrink-0 items-center">
              <span className="material-symbols-outlined text-3xl">sports_soccer</span>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-tight flex-1 text-center italic uppercase">Missed It!</h2>
            <div className="flex w-12 items-center justify-end">
              <button className="flex items-center justify-center rounded-xl h-12 w-12 bg-white/20 text-white">
                <span className="material-symbols-outlined">notifications</span>
              </button>
            </div>
          </header>

          <div className="px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-2xl font-black leading-tight tracking-tighter uppercase italic">Latest Blunders</h2>
              <span className="material-symbols-outlined text-white/50 text-4xl">sports_score</span>
            </div>
            <div className="flex flex-col gap-4">
              {missedGoals.map((goal, idx) => (
                <div 
                  key={goal._id} 
                  className={`bg-soccer-yellow rounded-xl p-4 shadow-xl border-2 border-black transform ${
                    idx % 2 === 0 ? '-rotate-1' : 'rotate-1'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-black text-soccer-yellow px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                      {goal.points >= 5 ? 'Missed Goal Fine' : 'Yellow Card Fine'}
                    </div>
                    <span className="material-symbols-outlined text-black font-bold">
                      {goal.points >= 5 ? 'priority_high' : 'warning'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <h3 className="text-black text-xl font-black leading-none mb-1">{goal.user}</h3>
                      <p className="text-black/70 text-sm font-bold uppercase tracking-tighter">
                        {new Date(goal.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-black text-2xl font-black">${goal.points.toFixed(2)}</p>
                    </div>
                  </div>
                  {goal.link && (
                    <a 
                      href={goal.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-4 pt-3 border-t border-black/10 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-black text-sm">visibility</span>
                        <span className="text-black text-xs font-black uppercase">View Evidence</span>
                      </div>
                      <span className="material-symbols-outlined text-black">arrow_right_alt</span>
                    </a>
                  )}
                </div>
              ))}
              {missedGoals.length === 0 && (
                <p className="text-center text-white/60 py-12 italic uppercase font-bold tracking-widest">No blunders recorded yet!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- BOTTOM NAVIGATION --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 flex gap-2 border-t border-primary/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pb-6 pt-2">
        <button 
          onClick={() => setCurrentTab('log')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 ${currentTab === 'log' ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className="material-symbols-outlined text-2xl">home</span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Pitch</p>
        </button>
        <button 
          onClick={() => setCurrentTab('leaderboard')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 ${currentTab === 'leaderboard' ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className="material-symbols-outlined text-2xl">leaderboard</span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Shame</p>
        </button>
        <div className="flex flex-1 flex-col items-center justify-center -mt-8">
          <button 
            onClick={() => setCurrentTab('log')}
            className="size-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-900 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
          <p className="text-[10px] font-bold uppercase tracking-tighter mt-1 text-primary">Log Miss</p>
        </div>
        <button 
          onClick={() => setCurrentTab('history')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 ${currentTab === 'history' ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className="material-symbols-outlined text-2xl">history</span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">History</p>
        </button>
        <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400">
          <span className="material-symbols-outlined text-2xl">account_circle</span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Player</p>
        </button>
      </nav>
    </div>
  );
}
