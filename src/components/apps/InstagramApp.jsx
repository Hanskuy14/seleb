/**
 * InstagramApp.jsx
 * Main Hub: Profile, Create Post (Reels/Stories), Live Stream
 * Focuses on aesthetics and Engagement Rate
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatNumber, calculatePostPerformance, CONTENT_THEMES, CAPTION_STYLES, randomChoice, randomInt, generateLiveComment, getLiveResponseOptions } from '../../utils/gameLogic';

function ProfileTab() {
  const { state } = useGame();
  const ig = state.platforms.instagram;

  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-hide">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px]">
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl">{state.avatar}</div>
        </div>
        <div className="flex-1">
          <h2 className="text-white font-bold text-sm">@{state.username}</h2>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/30">
            {formatNumber(ig.followers)} followers
          </span>
        </div>
      </div>
      <div className="flex items-center justify-around py-3 border-y border-gray-700/50 mb-4">
        <div className="text-center">
          <p className="text-white font-bold text-sm">{ig.posts.length}</p>
          <p className="text-gray-400 text-[10px]">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{formatNumber(ig.followers)}</p>
          <p className="text-gray-400 text-[10px]">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{ig.engagementRate.toFixed(1)}%</p>
          <p className="text-gray-400 text-[10px]">ER</p>
        </div>
      </div>


      {/* Trending */}
      <div className="mb-4">
        <p className="text-gray-400 text-[10px] mb-1.5">🔥 Trending:</p>
        <div className="flex flex-wrap gap-1.5">
          {state.trendingHashtags.map((t, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">#{t}</span>
          ))}
        </div>
      </div>
      {/* Post Grid */}
      <div className="grid grid-cols-3 gap-1">
        {ig.posts.length === 0 ? (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500 text-sm">No posts yet</p>
          </div>
        ) : ig.posts.slice(0, 12).map((post, i) => (
          <div key={i} className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-sm relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center text-2xl">{post.thumbnail}</div>
            {post.isViral && <div className="absolute top-1 right-1 text-[8px] bg-red-500 px-1 rounded">🔥</div>}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[9px]">❤️{formatNumber(post.likes)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function CreatePostTab() {
  const { state, createPost, useEnergy } = useGame();
  const [theme, setTheme] = useState('');
  const [caption, setCaption] = useState('');
  const [contentType, setContentType] = useState('post'); // post | reel | story
  const [result, setResult] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const ig = state.platforms.instagram;

  const energyCost = contentType === 'reel' ? 25 : contentType === 'story' ? 8 : 15;
  const thumbnails = ['📸', '🎬', '🖼️', '🌟', '💫', '🎭', '🌈', '✨'];

  const handleCreate = () => {
    if (!theme || !caption || state.energy < energyCost) return;
    setIsCreating(true);
    setTimeout(() => {
      const perf = calculatePostPerformance({
        platform: 'instagram', theme, captionStyle: caption, gear: state.gear,
        trends: state.trendingHashtags, followers: ig.followers,
        engagementRate: ig.engagementRate, reputation: state.reputation, niche: state.unlockedNiche,
      });
      // Reels get bonus
      if (contentType === 'reel') { perf.newFollowers = Math.floor(perf.newFollowers * 1.5); perf.likes = Math.floor(perf.likes * 1.3); }
      if (contentType === 'story') { perf.newFollowers = Math.floor(perf.newFollowers * 0.5); perf.likes = Math.floor(perf.likes * 0.4); }

      const post = { id: Date.now(), theme, caption, contentType, likes: perf.likes, comments: perf.comments, isViral: perf.isViral, thumbnail: randomChoice(thumbnails), day: state.day, quality: perf.quality };
      createPost({ platform: 'instagram', post, newFollowers: perf.newFollowers, lostFollowers: perf.lostFollowers, engagementDelta: perf.engagementDelta, reputationDelta: perf.reputationDelta, theme, energyCost });
      setResult(perf);
      setIsCreating(false);
      setTheme(''); setCaption('');
    }, 1200);
  };


  if (result) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center animate-fade-in">
        <p className="text-3xl mb-2">{result.isViral ? '🔥' : '📸'}</p>
        <h3 className="text-lg font-bold text-white mb-4">{result.isViral ? 'VIRAL!' : 'Posted!'}</h3>
        <div className="w-full space-y-2 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex justify-between"><span className="text-gray-400 text-xs">Likes</span><span className="text-white text-sm font-bold">❤️ {formatNumber(result.likes)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400 text-xs">New Followers</span><span className="text-green-400 text-sm font-bold">+{formatNumber(result.newFollowers)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400 text-xs">Quality</span><span className="text-blue-400 text-sm font-bold">{result.quality}/100</span></div>
        </div>
        <button onClick={() => setResult(null)} className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm">
          Create Another
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-hide">
      <h3 className="text-white font-bold text-sm mb-3">📝 Create Content</h3>
      {state.energy < energyCost && <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs">⚠️ Not enough energy! Sleep to recover.</div>}

      {/* Content type */}
      <p className="text-gray-400 text-[10px] mb-1.5">Format:</p>
      <div className="flex gap-2 mb-3">
        {[{ id: 'post', label: '📷 Post', cost: 15 }, { id: 'reel', label: '🎬 Reel', cost: 25 }, { id: 'story', label: '📱 Story', cost: 8 }].map(t => (
          <button key={t.id} onClick={() => setContentType(t.id)} className={`flex-1 py-2 rounded-lg text-[10px] font-medium border transition-all ${contentType === t.id ? 'bg-purple-500/30 border-purple-500 text-purple-200' : 'bg-gray-800/50 border-gray-700/50 text-gray-400'}`}>
            {t.label} (-{t.cost}⚡)
          </button>
        ))}
      </div>


      {/* Theme */}
      <p className="text-gray-400 text-[10px] mb-1.5">Theme:</p>
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {CONTENT_THEMES.map(t => (
          <button key={t.id} onClick={() => setTheme(t.id)} className={`p-1.5 rounded-lg text-center transition-all ${theme === t.id ? 'bg-purple-500/30 border-purple-500 border scale-105' : 'bg-gray-800/50 border-gray-700/50 border'}`}>
            <span className="text-base">{t.icon}</span>
            <p className="text-[8px] text-gray-300 mt-0.5">{t.label}</p>
            {state.trendingHashtags.some(h => h.toLowerCase().includes(t.id)) && <span className="text-[7px] text-pink-400">🔥</span>}
          </button>
        ))}
      </div>

      {/* Caption */}
      <p className="text-gray-400 text-[10px] mb-1.5">Style:</p>
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {CAPTION_STYLES.map(c => (
          <button key={c.id} onClick={() => setCaption(c.id)} className={`p-2 rounded-lg text-left transition-all ${caption === c.id ? 'bg-pink-500/30 border-pink-500 border' : 'bg-gray-800/50 border-gray-700/50 border'}`}>
            <span className="text-sm">{c.icon}</span>
            <p className="text-[9px] text-white font-medium">{c.label}</p>
            <p className="text-[8px] text-gray-400">{c.desc}</p>
          </button>
        ))}
      </div>

      <button onClick={handleCreate} disabled={!theme || !caption || isCreating || state.energy < energyCost}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${theme && caption && state.energy >= energyCost && !isCreating ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
        {isCreating ? '⏳ Creating...' : `📤 Publish (-${energyCost} ⚡)`}
      </button>
    </div>
  );
}


function LiveTab() {
  const { state, createPost, useEnergy, updateCash, addTransaction } = useGame();
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [currentComment, setCurrentComment] = useState(null);
  const [earnings, setEarnings] = useState(0);
  const [round, setRound] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const ig = state.platforms.instagram;

  const startStream = () => {
    if (state.energy < 25) return;
    setIsLive(true);
    setViewers(Math.floor(ig.followers * 0.02) + 5);
    setEarnings(0); setRound(0);
    spawnComment();
  };

  const spawnComment = () => setCurrentComment({ ...generateLiveComment(), id: Date.now() });

  const handleResponse = (resp) => {
    let vDelta = 0, eDelta = 0;
    if (resp.effect === 'great') { vDelta = randomInt(5, 20); eDelta = randomInt(5, 30); }
    else if (resp.effect === 'good') { vDelta = randomInt(1, 10); eDelta = randomInt(1, 10); }
    else if (resp.effect === 'bad') { vDelta = randomInt(-15, -5); }
    setViewers(v => Math.max(1, v + vDelta));
    setEarnings(e => e + eDelta);
    setRound(r => r + 1);
    if (round >= 6) { endStream(); return; }
    setTimeout(spawnComment, 600);
  };

  const endStream = () => {
    setIsLive(false); setShowResults(true);
    useEnergy(25);
    if (earnings > 0) {
      updateCash(earnings);
      addTransaction({ id: Date.now(), day: state.day, description: 'IG Live Gifts', category: 'Live Stream', amount: earnings });
    }
    const newF = Math.floor(viewers * 0.08);
    createPost({ platform: 'instagram', post: { id: Date.now(), theme: 'live', likes: viewers * 2, comments: round, isViral: false, thumbnail: '📡', day: state.day, quality: 50 }, newFollowers: newF, lostFollowers: 0, engagementDelta: 0.1, reputationDelta: 1, theme: 'lifestyle', energyCost: 0 });
  };


  if (showResults) return (
    <div className="p-4 h-full flex flex-col items-center justify-center animate-fade-in">
      <p className="text-3xl mb-2">🎬</p>
      <h3 className="text-lg font-bold text-white mb-4">Stream Ended!</h3>
      <div className="w-full bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-2">
        <div className="flex justify-between"><span className="text-gray-400 text-xs">Viewers</span><span className="text-white font-bold">{viewers}</span></div>
        <div className="flex justify-between"><span className="text-gray-400 text-xs">Earnings</span><span className="text-green-400 font-bold">${earnings}</span></div>
      </div>
      <button onClick={() => setShowResults(false)} className="mt-4 w-full py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm">Done</button>
    </div>
  );

  if (!isLive) return (
    <div className="p-4 h-full flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-4 text-2xl">📡</div>
      <h3 className="text-white font-bold mb-1">Go Live!</h3>
      <p className="text-gray-400 text-xs text-center mb-4">Interact with viewers & earn gifts</p>
      <button onClick={startStream} disabled={state.energy < 25} className={`w-full py-3 rounded-xl font-semibold text-sm ${state.energy >= 25 ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
        {state.energy < 25 ? 'Need 25 Energy' : '🔴 Start Live (-25⚡)'}
      </button>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <div className="flex items-center justify-between px-3 py-2 bg-black/50">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 rounded-full"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /><span className="text-white text-[9px] font-bold">LIVE</span></span>
          <span className="text-white text-xs">👁️ {viewers}</span>
        </div>
        <button onClick={endStream} className="text-xs text-red-400 px-2 py-1 border border-red-400/30 rounded-full">End</button>
      </div>
      {currentComment && (
        <div className="flex-1 flex flex-col justify-end px-3 pb-3">
          <div className="mb-2 p-2 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-white text-xs">💬 {currentComment.text}</p>
          </div>
          <div className="space-y-1.5">
            {getLiveResponseOptions(currentComment.type).map((r, i) => (
              <button key={i} onClick={() => handleResponse(r)} className="w-full p-2 rounded-lg bg-gray-800/80 border border-gray-700/50 text-left hover:bg-gray-700/80 active:scale-98 transition-all">
                <span className="text-white text-xs">{r.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ==================== MAIN ====================
export default function InstagramApp() {
  const [tab, setTab] = useState('profile');
  const tabs = [{ id: 'profile', icon: '👤', label: 'Profile' }, { id: 'create', icon: '➕', label: 'Create' }, { id: 'live', icon: '📡', label: 'Live' }];

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <h1 className="text-white font-bold text-base italic">Instagram</h1>
        <div className="flex items-center gap-2"><span className="text-base">❤️</span><span className="text-base">✉️</span></div>
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === 'profile' && <ProfileTab />}
        {tab === 'create' && <CreatePostTab />}
        {tab === 'live' && <LiveTab />}
      </div>
      <div className="flex items-center justify-around py-2 border-t border-gray-800 bg-gray-900">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${tab === t.id ? 'text-white' : 'text-gray-500'}`}>
            <span className="text-lg">{t.icon}</span><span className="text-[9px]">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
