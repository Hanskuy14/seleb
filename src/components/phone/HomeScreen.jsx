/**
 * HomeScreen.jsx
 * Phone home screen with expanded app grid for multi-platform ecosystem
 */
import { useGame } from '../../context/GameContext';
import { formatNumber, formatCurrency } from '../../utils/gameLogic';

const apps = [
  { id: 'instagram', name: 'Instagram', icon: '📸', gradient: 'from-purple-500 via-pink-500 to-orange-400' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', gradient: 'from-black to-gray-800' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', gradient: 'from-red-600 to-red-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', gradient: 'from-blue-700 to-blue-500' },
  { id: 'brokerage', name: 'Invest', icon: '📈', gradient: 'from-green-600 to-emerald-500' },
  { id: 'bank', name: 'Bank', icon: '🏦', gradient: 'from-blue-600 to-indigo-500' },
  { id: 'news', name: 'BuzzNews', icon: '📰', gradient: 'from-orange-500 to-amber-500' },
  { id: 'messages', name: 'Deals', icon: '💬', gradient: 'from-green-500 to-green-400' },
  { id: 'shop', name: 'Shop', icon: '🛍️', gradient: 'from-amber-500 to-orange-400' },
  { id: 'sleep', name: 'Sleep', icon: '😴', gradient: 'from-indigo-600 to-purple-700' },
];

export default function HomeScreen() {
  const { state, openApp, getTotalFollowers, getPortfolioValue } = useGame();
  const totalFollowers = getTotalFollowers();
  const portfolioVal = getPortfolioValue();


  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Wallpaper effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-5 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl" />
      </div>

      {/* Stats Widget */}
      <div className="relative mx-3 mt-3 mb-2 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
        <div className="flex items-center justify-between text-white mb-2">
          <div className="text-center">
            <p className="text-[9px] text-white/50">Followers</p>
            <p className="text-xs font-bold">{formatNumber(totalFollowers)}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] text-white/50">Cash</p>
            <p className="text-xs font-bold text-green-300">{formatCurrency(state.cash)}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] text-white/50">Portfolio</p>
            <p className="text-xs font-bold text-cyan-300">{formatCurrency(portfolioVal)}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] text-white/50">Rep</p>
            <p className="text-xs font-bold text-amber-300">{state.reputation}</p>
          </div>
        </div>
        {/* Energy bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all" style={{ width: `${state.energy}%` }} />
          </div>
          <span className="text-[9px] text-white/60">⚡{state.energy}</span>
        </div>
        {/* Niche badge */}
        {state.unlockedNiche && (
          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 to-pink-500/30 border border-amber-400/40">
            <span className="text-[9px] text-amber-200 font-medium">🏷️ {state.unlockedNiche} Niche (+20% boost)</span>
          </div>
        )}
      </div>


      {/* App Grid */}
      <div className="relative flex-1 px-3 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-4 gap-2 py-2">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 active:scale-90 transition-all duration-150"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-xl shadow-lg`}>
                {app.icon}
              </div>
              <span className="text-[9px] text-white/70 font-medium">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom bar - platform follower counts */}
      <div className="relative mt-auto px-3 pb-3">
        <div className="flex items-center justify-around p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">📸</span>
            <span className="text-[9px] text-white/60">{formatNumber(state.platforms.instagram.followers)}</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">🎵</span>
            <span className="text-[9px] text-white/60">{formatNumber(state.platforms.tiktok.followers)}</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">▶️</span>
            <span className="text-[9px] text-white/60">{formatNumber(state.platforms.youtube.followers)}</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">💼</span>
            <span className="text-[9px] text-white/60">{formatNumber(state.platforms.linkedin.followers)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
