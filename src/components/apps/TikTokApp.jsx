/**
 * TikTokApp.jsx
 * High-volatility algorithm - posts can flop or go viral exponentially
 * Trending sounds/hashtags give massive boosts
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatNumber, calculatePostPerformance, CONTENT_THEMES, randomChoice, randomInt } from '../../utils/gameLogic';

export default function TikTokApp() {
  const { state, createPost } = useGame();
  const [view, setView] = useState('feed'); // feed | create | result
  const [result, setResult] = useState(null);
  const [theme, setTheme] = useState('');
  const [useSound, setUseSound] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const tk = state.platforms.tiktok;
  const energyCost = 12;

  const SOUNDS = ['Trending Beat 🎶', 'Viral Audio 🔊', 'Original Sound 🎤', 'Remix 🎧'];

  const handlePost = () => {
    if (!theme || state.energy < energyCost) return;
    setIsCreating(true);
    setTimeout(() => {
      const perf = calculatePostPerformance({
        platform: 'tiktok', theme, captionStyle: 'humorous', gear: state.gear,
        trends: state.trendingHashtags, followers: tk.followers,
        engagementRate: tk.engagementRate, reputation: state.reputation, niche: state.unlockedNiche,
      });
      // TikTok sound bonus
      if (useSound) { perf.newFollowers = Math.floor(perf.newFollowers * 1.8); perf.likes = Math.floor(perf.likes * 1.5); }
      // Extra viral chance on TikTok
      if (Math.random() > 0.85) { perf.isViral = true; perf.newFollowers = randomInt(100, Math.floor(tk.followers * 0.8) + 200); }

      const views = perf.likes * randomInt(3, 8);
      const post = { id: Date.now(), theme, likes: perf.likes, views, comments: perf.comments, isViral: perf.isViral, thumbnail: randomChoice(['🎵', '🎬', '💃', '🕺', '🤳']), day: state.day };
      createPost({ platform: 'tiktok', post, newFollowers: perf.newFollowers, lostFollowers: perf.lostFollowers, engagementDelta: perf.engagementDelta, reputationDelta: perf.reputationDelta, theme, energyCost });
      setResult({ ...perf, views });
      setView('result');
      setIsCreating(false);
      setTheme('');
    }, 1000);
  };


  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-white font-bold text-base">🎵 TikTok</h1>
        <span className="text-[10px] text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">High Volatility</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {view === 'result' && result && (
          <div className="animate-fade-in text-center">
            <p className="text-4xl mb-3">{result.isViral ? '🚀' : '🎵'}</p>
            <h3 className="text-xl font-bold text-white mb-1">{result.isViral ? 'VIRAL! 🔥🔥🔥' : 'Posted!'}</h3>
            <p className="text-gray-400 text-xs mb-4">{result.isViral ? 'The algorithm chose you!' : 'Decent performance'}</p>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-2 text-left">
              <div className="flex justify-between"><span className="text-gray-400 text-xs">Views</span><span className="text-white font-bold">👁️ {formatNumber(result.views)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 text-xs">Likes</span><span className="text-white font-bold">❤️ {formatNumber(result.likes)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 text-xs">New Followers</span><span className="text-green-400 font-bold">+{formatNumber(result.newFollowers)}</span></div>
            </div>
            <button onClick={() => setView('feed')} className="mt-4 w-full py-2.5 rounded-xl bg-cyan-500 text-white font-semibold text-sm">Back</button>
          </div>
        )}

        {view === 'feed' && (
          <div>
            {/* Stats */}
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-4">
              <div className="flex items-center justify-around">
                <div className="text-center"><p className="text-white font-bold text-sm">{formatNumber(tk.followers)}</p><p className="text-gray-400 text-[9px]">Followers</p></div>
                <div className="text-center"><p className="text-white font-bold text-sm">{tk.engagementRate.toFixed(1)}%</p><p className="text-gray-400 text-[9px]">ER</p></div>
                <div className="text-center"><p className="text-white font-bold text-sm">{tk.posts.length}</p><p className="text-gray-400 text-[9px]">Videos</p></div>
              </div>
            </div>
            {/* Recent posts */}
            <p className="text-gray-400 text-xs font-semibold mb-2">Recent Videos</p>
            {tk.posts.length === 0 ? <p className="text-gray-500 text-xs text-center py-6">No videos yet - create your first!</p> : (
              <div className="space-y-2">
                {tk.posts.slice(0, 5).map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <span className="text-xl">{p.thumbnail}</span>
                    <div className="flex-1"><p className="text-white text-xs">Day {p.day}</p><p className="text-gray-400 text-[9px]">👁️{formatNumber(p.views)} ❤️{formatNumber(p.likes)}</p></div>
                    {p.isViral && <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">VIRAL</span>}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setView('create')} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm">➕ Create Video</button>
          </div>
        )}


        {view === 'create' && (
          <div className="animate-fade-in">
            <h3 className="text-white font-bold text-sm mb-3">🎬 Record TikTok</h3>
            {state.energy < energyCost && <p className="text-red-400 text-xs mb-2">⚠️ Need {energyCost} energy!</p>}

            <p className="text-gray-400 text-[10px] mb-1.5">Content Theme:</p>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {CONTENT_THEMES.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)} className={`p-1.5 rounded-lg text-center transition-all ${theme === t.id ? 'bg-cyan-500/30 border-cyan-500 border' : 'bg-gray-800/50 border-gray-700/50 border'}`}>
                  <span className="text-base">{t.icon}</span>
                  <p className="text-[8px] text-gray-300">{t.label}</p>
                </button>
              ))}
            </div>

            <p className="text-gray-400 text-[10px] mb-1.5">Trending Sound:</p>
            <button onClick={() => setUseSound(!useSound)} className={`w-full p-3 rounded-xl border mb-4 transition-all ${useSound ? 'bg-pink-500/20 border-pink-500 text-pink-300' : 'bg-gray-800/50 border-gray-700/50 text-gray-400'}`}>
              <span className="text-sm">{useSound ? '🎶 Using: ' + randomChoice(SOUNDS) : '🔇 No trending sound'}</span>
              <p className="text-[9px] mt-0.5">{useSound ? '+80% viral chance boost!' : 'Tap to use trending sound'}</p>
            </button>

            <button onClick={handlePost} disabled={!theme || isCreating || state.energy < energyCost}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${theme && state.energy >= energyCost ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
              {isCreating ? '⏳ Recording...' : `🎬 Post Video (-${energyCost}⚡)`}
            </button>
            <button onClick={() => setView('feed')} className="mt-2 w-full py-2 text-gray-400 text-xs">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
