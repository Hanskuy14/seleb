/**
 * HomeScreen.jsx
 * Phone home screen with app grid, wallpaper, and notification badges
 */
import { useGame } from '../../context/GameContext';
import { formatNumber, formatCurrency } from '../../utils/gameLogic';

const apps = [
  { id: 'instagram', name: 'InstaGram', icon: '📸', gradient: 'from-purple-500 via-pink-500 to-orange-400' },
  { id: 'bank', name: 'Bank', icon: '🏦', gradient: 'from-blue-600 to-blue-400' },
  { id: 'messages', name: 'Messages', icon: '💬', gradient: 'from-green-500 to-green-400' },
  { id: 'shop', name: 'Shop', icon: '🛍️', gradient: 'from-amber-500 to-orange-400' },
];

export default function HomeScreen() {
  const { state, openApp } = useGame();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Wallpaper decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-5 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
      </div>

      {/* Stats Widget */}
      <div className="relative mx-4 mt-4 mb-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
        <div className="flex items-center justify-between text-white">
          <div className="text-center">
            <p className="text-xs text-white/60">Followers</p>
            <p className="text-sm font-bold">{formatNumber(state.followers)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/60">Cash</p>
            <p className="text-sm font-bold text-green-300">{formatCurrency(state.cash)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/60">Day</p>
            <p className="text-sm font-bold">{state.day}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all"
              style={{ width: `${state.energy}%` }}
            />
          </div>
          <span className="text-[10px] text-white/60">⚡{state.energy}%</span>
        </div>
      </div>

      {/* Tier Badge */}
      <div className="relative mx-4 mb-4">
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/30 to-pink-500/30 border border-amber-400/40">
          <span className="text-[10px]">⭐</span>
          <span className="text-[10px] text-amber-200 font-medium">{state.tier} Influencer</span>
        </div>
      </div>

      {/* App Grid */}
      <div className="relative flex-1 px-6">
        <div className="grid grid-cols-2 gap-4">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:scale-105 active:scale-95 transition-all duration-200 relative"
            >
              {/* Notification Badge */}
              {state.notifications[app.id] > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse-badge">
                  <span className="text-[9px] text-white font-bold">{state.notifications[app.id]}</span>
                </div>
              )}

              {/* App Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                {app.icon}
              </div>
              <span className="text-[11px] text-white/80 font-medium">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Quick Stats */}
      <div className="relative mt-auto px-4 pb-4">
        <div className="flex items-center justify-around p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="flex items-center gap-1">
            <span className="text-xs">💕</span>
            <span className="text-[10px] text-white/70">{state.engagementRate.toFixed(1)}% ER</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1">
            <span className="text-xs">⭐</span>
            <span className="text-[10px] text-white/70">{state.reputation}/100 Rep</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1">
            <span className="text-xs">📊</span>
            <span className="text-[10px] text-white/70">{state.posts.length} Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
