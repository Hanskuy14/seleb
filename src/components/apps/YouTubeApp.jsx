/**
 * YouTubeApp.jsx
 * Long-form content: high energy cost, but generates consistent AdSense revenue
 * Requires scripting/editing phases, lifetime views accumulate
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatNumber, formatCurrency, calculatePostPerformance, calculateYouTubeRevenue, CONTENT_THEMES, randomChoice, randomInt } from '../../utils/gameLogic';

export default function YouTubeApp() {
  const { state, createPost, updateCash, addTransaction } = useGame();
  const [view, setView] = useState('channel'); // channel | create | result
  const [phase, setPhase] = useState('script'); // script | edit | publish
  const [theme, setTheme] = useState('');
  const [quality, setQuality] = useState('standard'); // standard | polished | cinematic
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const yt = state.platforms.youtube;

  const qualitySettings = {
    standard: { energyCost: 20, mult: 1.0, label: 'Standard', desc: 'Quick upload' },
    polished: { energyCost: 35, mult: 1.5, label: 'Polished', desc: 'Edited & scripted' },
    cinematic: { energyCost: 50, mult: 2.5, label: 'Cinematic', desc: 'Full production' },
  };
  const q = qualitySettings[quality];


  const handlePublish = () => {
    if (!theme || state.energy < q.energyCost) return;
    setIsProcessing(true);
    setTimeout(() => {
      const perf = calculatePostPerformance({
        platform: 'youtube', theme, captionStyle: 'genuine', gear: state.gear,
        trends: state.trendingHashtags, followers: yt.followers,
        engagementRate: yt.engagementRate, reputation: state.reputation, niche: state.unlockedNiche,
      });
      // Quality multiplier for YouTube
      perf.likes = Math.floor(perf.likes * q.mult);
      perf.newFollowers = Math.floor(perf.newFollowers * q.mult);
      const views = Math.floor(perf.likes * randomInt(5, 15) * q.mult);
      const adRevenue = calculateYouTubeRevenue(views);

      const video = { id: Date.now(), theme, quality, views, likes: perf.likes, comments: perf.comments, isViral: perf.isViral, thumbnail: randomChoice(['🎥', '📹', '🎬', '🖥️', '📺']), day: state.day, adRevenue };
      createPost({ platform: 'youtube', post: video, newFollowers: perf.newFollowers, lostFollowers: perf.lostFollowers, engagementDelta: perf.engagementDelta, reputationDelta: perf.reputationDelta + 1, theme, energyCost: q.energyCost });

      // Pay AdSense immediately (simplified)
      if (adRevenue > 0) {
        updateCash(adRevenue);
        addTransaction({ id: Date.now(), day: state.day, description: `YouTube AdSense: ${formatNumber(views)} views`, category: 'AdSense', amount: adRevenue });
      }
      setResult({ ...perf, views, adRevenue });
      setView('result');
      setIsProcessing(false);
      setTheme(''); setPhase('script');
    }, 1500);
  };


  return (
    <div className="h-full flex flex-col bg-gray-950">
      <div className="px-4 py-2.5 border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-white font-bold text-base">▶️ YouTube</h1>
        <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">AdSense: {formatCurrency(yt.adRevenue || 0)}</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {/* RESULT VIEW */}
        {view === 'result' && result && (
          <div className="animate-fade-in text-center">
            <p className="text-4xl mb-3">{result.isViral ? '🏆' : '🎬'}</p>
            <h3 className="text-xl font-bold text-white mb-1">{result.isViral ? 'Trending! #1' : 'Video Published!'}</h3>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-2 text-left mt-4">
              <div className="flex justify-between"><span className="text-gray-400 text-xs">Views</span><span className="text-white font-bold">👁️ {formatNumber(result.views)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 text-xs">Likes</span><span className="text-white font-bold">👍 {formatNumber(result.likes)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 text-xs">New Subs</span><span className="text-green-400 font-bold">+{formatNumber(result.newFollowers)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 text-xs">Ad Revenue</span><span className="text-yellow-400 font-bold">${result.adRevenue.toFixed(2)}</span></div>
            </div>
            <button onClick={() => setView('channel')} className="mt-4 w-full py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm">Back to Channel</button>
          </div>
        )}

        {/* CHANNEL VIEW */}
        {view === 'channel' && (
          <div>
            <div className="bg-gradient-to-r from-red-600/20 to-red-800/20 rounded-xl p-3 border border-red-500/30 mb-4">
              <div className="flex items-center justify-around">
                <div className="text-center"><p className="text-white font-bold">{formatNumber(yt.followers)}</p><p className="text-gray-400 text-[9px]">Subscribers</p></div>
                <div className="text-center"><p className="text-white font-bold">{formatNumber(yt.totalViews)}</p><p className="text-gray-400 text-[9px]">Total Views</p></div>
                <div className="text-center"><p className="text-white font-bold">{(yt.videos || []).length}</p><p className="text-gray-400 text-[9px]">Videos</p></div>
              </div>
            </div>


            <p className="text-gray-400 text-xs font-semibold mb-2">Recent Videos</p>
            {(yt.videos || []).length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-6">No videos yet. Upload your first!</p>
            ) : (
              <div className="space-y-2">
                {(yt.videos || []).slice(0, 6).map((v, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-800/40 rounded-xl border border-gray-700/30">
                    <div className="w-16 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-xl">{v.thumbnail}</div>
                    <div className="flex-1">
                      <p className="text-white text-xs font-medium">{v.theme} • Day {v.day}</p>
                      <p className="text-gray-400 text-[9px]">👁️{formatNumber(v.views)} 👍{formatNumber(v.likes)} 💰${v.adRevenue?.toFixed(0) || 0}</p>
                    </div>
                    {v.isViral && <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">🔥</span>}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setView('create')} className="mt-4 w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-500 transition-all">
              📹 Upload Video
            </button>
          </div>
        )}


        {/* CREATE VIEW - Multi-phase */}
        {view === 'create' && (
          <div className="animate-fade-in">
            <h3 className="text-white font-bold text-sm mb-1">📹 Upload Video</h3>
            <p className="text-gray-400 text-[9px] mb-4">YouTube requires more effort but pays AdSense!</p>

            {/* Phase indicator */}
            <div className="flex gap-1 mb-4">
              {['script', 'edit', 'publish'].map((p, i) => (
                <div key={p} className={`flex-1 h-1 rounded-full ${['script', 'edit', 'publish'].indexOf(phase) >= i ? 'bg-red-500' : 'bg-gray-700'}`} />
              ))}
            </div>

            {phase === 'script' && (
              <div>
                <p className="text-gray-400 text-[10px] mb-1.5">1. Choose Topic:</p>
                <div className="grid grid-cols-4 gap-1.5 mb-4">
                  {CONTENT_THEMES.map(t => (
                    <button key={t.id} onClick={() => setTheme(t.id)} className={`p-1.5 rounded-lg text-center transition-all ${theme === t.id ? 'bg-red-500/30 border-red-500 border' : 'bg-gray-800/50 border-gray-700/50 border'}`}>
                      <span className="text-base">{t.icon}</span>
                      <p className="text-[8px] text-gray-300">{t.label}</p>
                    </button>
                  ))}
                </div>
                <button onClick={() => theme && setPhase('edit')} disabled={!theme} className={`w-full py-2.5 rounded-xl text-sm font-semibold ${theme ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-500'}`}>
                  Next: Edit →
                </button>
              </div>
            )}

            {phase === 'edit' && (
              <div>
                <p className="text-gray-400 text-[10px] mb-1.5">2. Production Quality:</p>
                <div className="space-y-2 mb-4">
                  {Object.entries(qualitySettings).map(([key, val]) => (
                    <button key={key} onClick={() => setQuality(key)} className={`w-full p-3 rounded-xl border text-left transition-all ${quality === key ? 'bg-red-500/20 border-red-500' : 'bg-gray-800/50 border-gray-700/50'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white text-xs font-semibold">{val.label}</p>
                          <p className="text-gray-400 text-[9px]">{val.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 text-xs font-bold">-{val.energyCost}⚡</p>
                          <p className="text-green-400 text-[9px]">x{val.mult} quality</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setPhase('publish')} className="w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold">
                  Next: Publish →
                </button>
              </div>
            )}

            {phase === 'publish' && (
              <div className="text-center">
                <p className="text-3xl mb-3">🎬</p>
                <p className="text-white font-semibold mb-1">Ready to Upload!</p>
                <p className="text-gray-400 text-xs mb-4">Topic: {theme} • Quality: {q.label} • Cost: {q.energyCost}⚡</p>
                {state.energy < q.energyCost && <p className="text-red-400 text-xs mb-2">⚠️ Not enough energy!</p>}
                <button onClick={handlePublish} disabled={state.energy < q.energyCost || isProcessing}
                  className={`w-full py-3 rounded-xl font-semibold text-sm ${state.energy >= q.energyCost ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-500'}`}>
                  {isProcessing ? '⏳ Uploading...' : '🚀 Publish Video'}
                </button>
              </div>
            )}
            <button onClick={() => { setView('channel'); setPhase('script'); }} className="mt-2 w-full py-2 text-gray-400 text-xs">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
