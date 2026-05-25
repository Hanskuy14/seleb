/**
 * SleepApp.jsx
 * End Day mechanic: resets energy, advances calendar, triggers overnight calculations
 * Deducts living expenses, updates markets, calculates follower growth/loss
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/gameLogic';

export default function SleepApp() {
  const { state, sleep, addNotification } = useGame();
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepReport, setSleepReport] = useState(null);

  const handleSleep = () => {
    setIsSleeping(true);
    // Capture before-state for report
    const beforeCash = state.cash;
    const beforeFollowers = Object.entries(state.platforms).reduce((s, [, p]) => s + p.followers, 0);

    setTimeout(() => {
      sleep();
      setIsSleeping(false);

      // Generate a notification
      addNotification({ id: Date.now(), text: `Good morning! Day ${state.day + 1} begins.`, icon: '☀️', time: Date.now() });

      setSleepReport({
        newDay: state.day + 1,
        isExpenseDay: (state.day + 1) % 30 === 0,
        isTaxDay: (state.day + 1) % 90 === 0,
        expenses: (state.day + 1) % 30 === 0 ? state.monthlyExpenses : 0,
      });
    }, 2000);
  };

  if (sleepReport) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-indigo-950 to-purple-950 items-center justify-center p-6">
        <div className="animate-fade-in text-center">
          <p className="text-4xl mb-3">☀️</p>
          <h2 className="text-2xl font-bold text-white mb-2">Day {sleepReport.newDay}</h2>
          <p className="text-indigo-300 text-sm mb-6">A new day, new opportunities!</p>

          <div className="w-full bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 space-y-2 text-left">
            <div className="flex justify-between"><span className="text-indigo-300 text-xs">⚡ Energy</span><span className="text-green-400 text-xs font-bold">Restored to 100%</span></div>
            <div className="flex justify-between"><span className="text-indigo-300 text-xs">📰 News</span><span className="text-white text-xs font-bold">Updated</span></div>
            <div className="flex justify-between"><span className="text-indigo-300 text-xs">📈 Markets</span><span className="text-white text-xs font-bold">Prices moved</span></div>
            <div className="flex justify-between"><span className="text-indigo-300 text-xs">🔥 Trends</span><span className="text-white text-xs font-bold">Refreshed</span></div>
            {sleepReport.isExpenseDay && (
              <div className="flex justify-between"><span className="text-red-300 text-xs">💸 Bills</span><span className="text-red-400 text-xs font-bold">-{formatCurrency(sleepReport.expenses)}</span></div>
            )}
            {sleepReport.isTaxDay && (
              <div className="flex justify-between"><span className="text-yellow-300 text-xs">🏛️ Tax</span><span className="text-yellow-400 text-xs font-bold">Deducted</span></div>
            )}
          </div>

          <button onClick={() => setSleepReport(null)} className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm">
            🌅 Start the Day
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-950 to-purple-950 items-center justify-center p-6">
      {isSleeping ? (
        <div className="animate-fade-in text-center">
          <p className="text-5xl mb-4 animate-pulse">🌙</p>
          <h2 className="text-xl font-bold text-white mb-2">Sleeping...</h2>
          <p className="text-indigo-300 text-sm">Markets moving, followers growing...</p>
          <div className="mt-4 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-indigo-400 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-5xl mb-4">😴</p>
          <h2 className="text-2xl font-bold text-white mb-2">End Day {state.day}</h2>
          <p className="text-indigo-300 text-sm mb-6">Rest to recover energy and advance time</p>

          {/* What happens */}
          <div className="w-full bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 text-left mb-6">
            <h3 className="text-white text-xs font-bold mb-2">What happens overnight:</h3>
            <div className="space-y-1.5">
              <p className="text-indigo-200 text-[10px]">✅ Energy restored to 100%</p>
              <p className="text-indigo-200 text-[10px]">✅ New daily news & trends generated</p>
              <p className="text-indigo-200 text-[10px]">✅ Market prices update based on news</p>
              <p className="text-indigo-200 text-[10px]">✅ Organic follower growth/decay</p>
              <p className="text-indigo-200 text-[10px]">✅ Mutual fund yields compound</p>
              {(state.day + 1) % 30 === 0 && <p className="text-red-300 text-[10px]">⚠️ Monthly bills: -{formatCurrency(state.monthlyExpenses)}</p>}
              {(state.day + 1) % 90 === 0 && <p className="text-yellow-300 text-[10px]">⚠️ Quarterly tax deduction</p>}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-indigo-300 text-xs">Current Energy:</span>
            <span className={`text-xs font-bold ${state.energy > 50 ? 'text-green-400' : state.energy > 20 ? 'text-yellow-400' : 'text-red-400'}`}>{state.energy}/100</span>
          </div>

          <button onClick={handleSleep} className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all">
            🛏️ Sleep & End Day
          </button>
        </div>
      )}
    </div>
  );
}
